import test from 'ava';

// Checking platform
test('Checking if the test is running on Windows', t => {
	t.is(process.platform, 'win32', 'The test should be proceeded on Windows.');
});
