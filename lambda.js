const awsServerlessExpress = require('aws-serverless-express');
//const {app} = require("./app");
//aws serverless swap
const {app} = require("./app-serverless");


const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  awsServerlessExpress.proxy(server, event, context);
}
