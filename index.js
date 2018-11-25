require('@babel/register');

if (process.platform !== 'win32') {
	throw new Error('This module only works on Windows.');
}

module.exports = require('./src');
module.exports.Caller = require('./src/caller');
