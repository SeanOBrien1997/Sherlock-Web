const express = require('express');
const spawn = require('child_process').spawn;

const app = express();
const PYTHON_COMMAND = 'python3';
const SHERLOCK_PATH = 'sherlock/sherlock/sherlock.py';
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	const username = req.query.username;
	const sherlock = spawn(PYTHON_COMMAND, [SHERLOCK_PATH, username]);

	let outputChunks = [];

	sherlock.on('exit', (exitCode) => {
		console.log(`Sherlock exited with: ${exitCode}`);
	});

	sherlock.stdout.on('data', (data) => {
		outputChunks = outputChunks.concat(data);
	});

	sherlock.stdout.on('end', () => {
		const stdoutContent = Buffer.concat(outputChunks).toString();
		res.send(stdoutContent);
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
