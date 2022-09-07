const { mainProcessor } = require("../services/mainProcessor");

const processWebhook = async (req, res) => {
	console.log(req);
	const conversationId = req.body.data.data.conversationId;
	mainProcessor(conversationId);
	res.sendStatus(200);
};

module.exports = {
	processWebhook,
};
