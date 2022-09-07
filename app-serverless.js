const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const webhookRouter = require("./routes/webhookRouter")
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use("/", webhookRouter.router)

module.exports = {
  app
}