import * as net from 'net';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

class Soundpad {
	constructor(connectionSettings, pollingInterval = 1000) {
		this.pipe = false;

		connectionSettings = _.defaults(connectionSettings, {
			autoReconnect: true,
			reconnectInterval: 1000,
			timeout: 1000
		});
		this.autoReconnect = connectionSettings.autoReconnect;
		this.connectionTimeout = connectionSettings.timeout;
		this.reconnectInterval = connectionSettings.reconnectInterval;

		this.pollingInterval = pollingInterval;
	}

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
