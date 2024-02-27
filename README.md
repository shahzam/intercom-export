# intercom-export
A simple NodeJS script to export full conversation history from Intercom using their API, and save the data into a JSON file.

This script could be helpful if you need a bulk export of your conversations, since Intercom mentions that you can't directly export all conversations through their user interface: https://www.intercom.com/help/en/articles/2046229-export-your-conversations-data

# How to Use

In the `intercom-export.js` file, simply enter your API access token into the `INTERCOM_TOKEN` constant at the top of the file, and then run
`node intercom-export.js` from the command prompt.

That will save a file named `exported-data.json` into the working directory. The exported JSON will contain an Intercom Conversation object for each conversation, and each conversation will also contain an array called `messages` that contains the details of a single conversation.
