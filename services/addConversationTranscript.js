const axios = require("axios");
const MONDAY_AUTH_TOKEN = process.env.MONDAY_AUTH_TOKEN;

const addConversationTranscript = (newItemId, conversationTranscript) => {
	axios({
		url: "https://api.monday.com/v2",
		method: "post",
		data: {
			query: `mutation{
    create_update (item_id: ${newItemId}, body: ${JSON.stringify(
				conversationTranscript
			)}) {
        id
    }
}`,
		},
		headers: {
			Authorization: MONDAY_AUTH_TOKEN,
			"Content-Type": "application/json",
		},
	});
};

module.exports = {
	addConversationTranscript,
};
