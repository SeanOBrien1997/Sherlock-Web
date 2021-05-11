import React, { useState } from 'react';
import TableRow from './TableRow';
import logo from './logo.svg';
import './App.css';

function App() {
	const [formValue, setFormValue] = useState('');
	const [userData, setUserData] = useState('');
	const [tableStyle, setTableStyle] = useState('hidden');
	const searchUser = async (e) => {
		e.preventDefault();
		console.log(`Fetching ${formValue}`);
		fetch(`/user/${formValue}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then((response) => response.json())
			.then((result) => {
				setUserData(result);
			});
	};

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
			<div className="App-header">
				<div className="search-bar">
					<form onSubmit={searchUser}>
						<input
							placeholder="Search for a username"
							value={formValue}
							onChange={(e) => setFormValue(e.target.value)}
						/>
						<button type="submit" disable="true">
							Search
						</button>
					</form>
				</div>
				<div className="table-bar">
					<div className={tableStyle}>
						<p className="msg">
							A total of {userData.count} site(s) were found.
						</p>
					</div>
					<table className={tableStyle} id="data-table">
						<thead>
							<tr>
								<th>Site name</th>
								<th>Link</th>
							</tr>
						</thead>
						<tbody>
							{userData.sites &&
								Object.entries(userData.sites).map((site) => (
									<TableRow key={site.key} message={site} />
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default App;
