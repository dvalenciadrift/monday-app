const express = require("express")
const {processWebhook} = require("../controllers/webhookController")
const router = express.Router()

router.use('/', processWebhook)

module.exports = {
    router,
};