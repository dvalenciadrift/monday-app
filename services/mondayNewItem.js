const axios = require("axios");
const MONDAY_AUTH_TOKEN = process.env.MONDAY_AUTH_TOKEN;
const BOARD_ID = provess.env.BOARD_ID;

const mondayNewItem = (contactFirstName, contactLastName, contactEmail) => {
	const variables = {
		boardId: BOARD_ID,
		itemName: `${contactFirstName} ${contactLastName}`,
		columnValues: JSON.stringify({
			email: { email: `${contactEmail}`, text: `${contactEmail}` },
			text: "Drift",
			status: { label: "New" },
			date4: { date: new Date().toISOString().slice(0, 10) },
		}),
	};

	axios({
		url: "https://api.monday.com/v2",
		method: "post",
		data: {
			query: `mutation create_item ($boardId: Int!, $itemName: String!, $columnValues: JSON!) { 
    create_item (
        board_id: $boardId,
        item_name: $itemName, 
        column_values: $columnValues
    ) 
    { 
        id
    } 
}`,
			variables,
		},
		headers: {
			Authorization: MONDAY_AUTH_TOKEN,
			"Content-Type": "application/json",
		},
	});
};

module.exports = {
	mondayNewItem,
};
