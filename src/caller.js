class Caller {
	/**
	 * @constructor
	 * @param {Soundpad} soundpad - Connected Soundpad instance to send command.
	 */
	constructor(soundpad) {
		this.soundpad = soundpad;
	}
}

module.exports = Caller;
