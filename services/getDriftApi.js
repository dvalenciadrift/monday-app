//Single function to make GET requests to different Drift API points
const DRIFT_TOKEN = process.env.DRIFT_TOKEN;
const axios = require("axios");

const getDriftApi = (APIbase, endpointId) => {
	return axios
		.get(`${APIbase + endpointId}`, {
			headers: { Authorization: `Bearer ${DRIFT_TOKEN}` },
		})
		.then((res) => {
			console.log("Console inside drift api", res.data.data);
			return res.data.data;
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = {
	getDriftApi,
};
