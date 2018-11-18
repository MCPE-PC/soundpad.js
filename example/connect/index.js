const soundpad = require('../../')(); // eslint-disable-line unicorn/import-index

console.log('Connecting to Soundpad...');
soundpad.connect().then(() => {
	console.log('Connected to Soundpad.');
});
