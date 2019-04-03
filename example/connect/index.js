const Soundpad = require('../..');

const soundpad = new Soundpad();
console.log('Connecting to Soundpad...');
soundpad.connect().then(() => {
	console.log('Connected to Soundpad');
	soundpad.disconnect();
});
