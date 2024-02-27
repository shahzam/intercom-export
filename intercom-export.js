const INTERCOM_TOKEN = "ENTER YOUR ACCESS TOKEN HERE";

const fetch = require('node-fetch');
const fs = require('fs');

async function run() {
	let exportData = [];

	let morePages = true;
	let startingAfter = "";

	while (morePages) {
		let params = {
			per_page: '100'
		};

		if (startingAfter) {
			params.starting_after = startingAfter;
		}

		const query = new URLSearchParams(params).toString();

		// Grab the list of conversations (supports pagination)
		const resp = await fetch(
			`https://api.intercom.io/conversations?${query}`,
			{
				method: 'GET',
				headers: {
					'Intercom-Version': '2.10',
					Authorization: 'Bearer ' + INTERCOM_TOKEN
				}
			}
		);

		const data = await resp.json();

		// Go through the conversations and grab the individual messages
		let conversations = data.conversations;

		for (let c of conversations) {
			let exportConversation = c;

			const messageQuery = new URLSearchParams({display_as: 'string'}).toString();

			const conversationId = c.id;
			
			console.log("Retrieving conversation: " + conversationId);
			
			const messageResp = await fetch(
				`https://api.intercom.io/conversations/${conversationId}?${messageQuery}`,
				{
					method: 'GET',
					headers: {
						'Intercom-Version': '2.10',
						Authorization: 'Bearer ' + INTERCOM_TOKEN
					}
				}
			);

			let messages = await messageResp.json();

			exportConversation.messages = messages;

			exportData.push(exportConversation);
		}

		if (data && data.pages && data.pages.next && data.pages.next.starting_after) {
			startingAfter = data.pages.next.starting_after;
			console.log("NEXT PAGE " + data.pages.next.page);
		} else {
			morePages = false;
			console.log("NO MORE PAGES")
		}
	}

	fs.writeFile('exported-data.json', JSON.stringify(exportData), 'utf8', (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("File written successfully\n");
		}
	});
}

run();
