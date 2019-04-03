import net from 'net';
import test from 'ava';
import Soundpad from '.'; // Also performs platform checking

// Bind named pipe server
const server = net.createServer();
server.listen(Soundpad.pipeName, () => {
	const soundpad = new Soundpad({autoReconnect: false});
	test('Connect pipe', async t => {
		await t.notThrowsAsync(soundpad.connect());
	});
});
