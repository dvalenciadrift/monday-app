const ngrok = require("ngrok");
const ngrokStartup = async () => {
	const url = await ngrok.connect(process.env.PORT);
	console.log(`Webhook URL is: ${url}/endpoint`);
};
module.exports = {
	ngrokStartup,
};
