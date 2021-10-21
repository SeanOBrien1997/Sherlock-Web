import React from 'react';
import './App.css';

function TableRow(props) {
	const siteName = props.message[0];
	const siteUrl = props.message[1];
	console.log('Fired', props);
	return (
		<tr>
			<td>{siteName}</td>
			<td>
				<a href={siteUrl}>{siteUrl}</a>
			</td>
		</tr>
	);
}

export default TableRow;
