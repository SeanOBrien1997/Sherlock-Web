const express = require('express');
const spawn = require('child_process').spawn;
const fs = require('fs');
const eol = require('eol');

const app = express();
const PYTHON_COMMAND = 'python3';
const SHERLOCK_PATH = 'sherlock/sherlock/sherlock.py';
const port = 9090;

app.use(express.json());

app.route('/user/:name').get((req, res) => {
	const username = req.params.name;

	if (username === undefined) {
		res.send('Username undefined');
		return;
	}

	const sherlock = spawn(PYTHON_COMMAND, [SHERLOCK_PATH, username]);
	let outputChunks = [];

	sherlock.on('exit', (exitCode) => {
		console.log(`Sherlock exited with: ${exitCode}`);
	});

	sherlock.stdout.on('data', (data) => {
		outputChunks = outputChunks.concat(data);
	});

	sherlock.stdout.on('end', () => {
		let response = {
			count: 0,
			sites: {},
		};
		const stdoutContent = Buffer.concat(outputChunks).toString();
		let lines = eol.split(stdoutContent);
		lines.shift(); // get rid of checking username line
		lines.forEach((line) => {
			line = line.replace('[+]', '');
			let urlData = line.split(' http');
			if (!(urlData[1] === undefined)) {
				const siteName = urlData[0].replace(':', '').trim();
				const siteURL = 'http'.concat(urlData[1]);
				response.sites[siteName] = siteURL;
			}
		});
		response.count = Object.keys(response.sites).length;
		res.send(response);
		const fileName = `./${username}.txt`;
		fs.unlink(fileName, (err) => {
			if (err) {
				console.log(err);
				return;
			}
		});
	});
});

app.get('/', (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
