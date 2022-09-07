const DRIFT_TOKEN = process.env.DRIFT_TOKEN;
const axios = require("axios");

const getTranscript = (conversationId) => {
	return axios
		.get(
			"https://driftapi.com/conversations/" + conversationId + "/transcript",
			{ headers: { Authorization: `Bearer ${DRIFT_TOKEN}` } }
		)
		.then((res) => {
			return res.data;
		});
};

module.exports = {
	getTranscript,
};
