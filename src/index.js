import * as net from 'net';
import * as _ from 'lodash';

const Promise = require('bluebird');
const log = require('debug')(__filename);

const tracker = log.extend('trace');
tracker.log = (data, ...args) => {
	console.error('Function %s was called', data, ...args);
};

class Soundpad {
	/**
	 * @constructor
	 * @param {object} connectionSettings - Settings of connecting Soundpad
	 * @param {number} pollingInterval - Interval of polling Soundpad.
	 */
	constructor(connectionSettings, pollingInterval = 1000) {
		tracker('constructor');

		this.connected = false;
		this.pipe = false;
		this.writing = false;

		connectionSettings = _.defaults(connectionSettings, {
			autoReconnect: true,
			reconnectInterval: 1000,
			timeout: 1000
		});
		this.autoReconnect = connectionSettings.autoReconnect;
		this.connectionTimeout = connectionSettings.timeout;
		this.reconnectInterval = connectionSettings.reconnectInterval;
		this.timeout = connectionSettings.timeout;

		this.pollingInterval = pollingInterval;
	}

	/**
	 * Connects to Soundpad.
	 * @returns {Promise} Resolves the Soundpad instance when connected Soundpad successfully.
	 */
	connect() {
		tracker('connect');

		return new Promise((resolve, reject) => {
			const socket = new net.Socket();
			socket.setTimeout(this.timeout);
			socket.connect({
				path: '\\\\.\\pipe\\sp_remote_control'
			}, () => {
				socket.removeAllListeners();
				this.pipe = socket;
				this.connected = true;
				setInterval(this.poll, this.pollingInterval);
				resolve(this);
			});
			socket.on('error', () => {
				if (this.autoReconnect) {
					Promise.delay(this.reconnectInterval).then(() => {
						this.connect();
					});
				} else {
					reject(new Error('Soundpad could not be connected.this.pipe'));
				}
			});
		});
	}

	/**
	 * Disconnects Soundpad.
	 * @returns {Promise} Resolves the Soundpad instance when disconnected Soundpad successfully.
	 */
	disconnect() {
		tracker('disconnect');

		return new Promise((resolve, reject) => {
			if (this.connected) {
				this.pipe.end();
				this.pipe = false;
				resolve(this);
			} else {
				reject(new Error('Soundpad is not connected or not a socket.'));
			}
		});
	}

	/**
	 * Poll Soundpad.
	 * @returns {Promise} Resolves the Soundpad instance when Soundpad respond.
	 */
	poll() {
		tracker('poll');

		return new Promise((resolve, reject) => {
			this.send('IsAlive()').then(() => {
				resolve(this);
			}, error => {
				reject(error);
			});
		});
	}

	/**
	 * Send `data` to Soundpad.
	 * @param {string|Buffer|Uint8Array} data - Data which will be sent.
		* @param {boolean} hasResponse - Wait until response?
	 * @returns {Promise} Resolves response if `hasResponse` is `true`,
		* or resolves the Soundpad instance when the data is sent.
	 */
	send(data, hasResponse = false) {
		tracker('send');

		return new Promise((resolve, reject) => {
			if (this.writing) {
				reject(new Error('Cannot send data while other data is being sent.'));
			}
			if (this.connected) {
				this.writing = true;
				if (typeof data === 'string') {
					data = Buffer.from(data);
				}
				if (hasResponse) {
					this.pipe.on('data', data => {
						this.pipe.removeAllListeners('data');
						this.writing = false;
						resolve(data);
					});
				}
				this.pipe.write(data, 'utf8', () => {
					this.writing = false;
					if (!hasResponse) {
						resolve(this);
					}
				});
				if (this.writing) {
					reject(new Error('Could not be sent to Soundpad.'));
				}
			} else {
				reject(new Error('Soundpad is not connected or not a socket.'));
			}
		});
	}
}

module.exports = (...args) => {
	return new Promise((resolve, reject) => {
		try {
			resolve(new Soundpad(...args));
		} catch (error) {
			reject(error);
		}
	});
};
