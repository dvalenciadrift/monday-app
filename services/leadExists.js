const axios = require("axios");
const MONDAY_AUTH_TOKEN = process.env.MONDAY_AUTH_TOKEN;

const leadExists = (contactEmail) => {
	return axios({
		url: "https://api.monday.com/v2",
		method: "post",
		data: {
			query: `query {
    items_by_column_values (board_id: 3169358815, column_id: "email", column_value: ${JSON.stringify(
			contactEmail
		)}) {
        id
        name
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
	leadExists,
};
