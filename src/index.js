import * as net from 'net';
import * as Promise from 'bluebird';
import * as debug from 'debug';
import * as _ from 'lodash';

const log = debug(__filename);
const tracker = log.extend('trace');
tracker.log = (data, ...args) => {
	console.error('Function' + data + ' was called', ...args);
};

class Soundpad {
	/**
	 * @constructor
	 * @param {object} connectionSettings - Settings of connecting Soundpad
	 * @param {number} pollingInterval - Interval of polling Soundpad.
	 */
	constructor(connectionSettings, pollingInterval = 1000) {
		tracker(arguments.callee.name); // eslint-disable-line no-caller

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

		setInterval(this.poll, pollingInterval);
	}

	/**
	 * Connects to Soundpad
	 * @returns {Promise} Resolves the Soundpad instance when connected Soundpad successfully.
	 */
	connect() {
		return new Promise((resolve, reject) => {
			const socket = new net.Socket();
			socket.setTimeout(this.timeout);
			socket.connect({
				path: '\\\\.\\sp_remote_control\\'
			}, () => {
				this.pipe = socket;
				resolve(this);
			});
			if (!this.pipe) {
				if (this.autoReconnect) {
					Promise.delay(this.reconnectInterval).then(() => {
						this.connect();
					});
				} else {
					reject(new Error('Soundpad could not be connected.'));
				}
			}
		});
	}

	/**
	 * Disconnects Soundpad
	 * @returns {Promise} Resolves the Soundpad instance when disconnected Soundpad successfully.
	 */
	disconnect() {
		return new Promise((resolve, reject) => {
			if (this.pipe instanceof net.Socket) {
				this.pipe.end();
				this.pipe = false;
				resolve(this);
			} else {
				reject(new Error('Soundpad is not connected or not a socket.'));
			}
		});
	}

	poll() {
		return new Promise((resolve, reject) => {
			this.send('IsAlive()').then(() => {
				resolve(this);
			}, error => {
				reject(error);
				console.error('Poll is not sent to Soundpad!');
			});
		});
	}

	send(data, hasResponse = false) {
		return new Promise((resolve, reject) => {
			if (this.writing) {
				reject(new Error('Cannot send data while other data is being sent.'));
			}
			this.writing = true;
			if (this.pipe instanceof net.Socket) {
				if (typeof data === String) {
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
					if (this.writing) {
						reject(new Error('Could not be sent to Soundpad.'));
					}
				});
			} else {
				reject(new Error('Soundpad is not connected or not a socket.'));
			}
		});
	}
}

export default function soundpad(...args) {
	return new Promise((resolve, reject) => {
		try {
			resolve(new Soundpad(...args));
		} catch (error) {
			reject(error);
		}
	});
}
