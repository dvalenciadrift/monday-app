//Declare dependencies
require('dotenv').config()
const ngrok = require('ngrok')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const axios = require("axios")


//Define Variables
const app = express()
const port = process.env.PORT || 4040
const conversationApiBase = 'https://driftapi.com/conversations/'
const contactsApiBase = 'https://driftapi.com/contacts/'
const DRIFT_TOKEN = process.env.DRIFT_TOKEN
const MONDAY_AUTH_TOKEN = process.env.MONDAY_AUTH_TOKEN


//leverage middleware for response/request objects
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//serve server locally
app.listen(port, () => {
    console.log(`App running locally on: http://localhost:${port}`);
});

//expose local webserver to internet
startNgrok = async () => {
    const url = await ngrok.connect(port)
    console.log(`Webhook URL is: ${url}/endpoint`)
}
startNgrok()

//Handling POST request
app.post('/endpoint', async (req, res) => {
    const conversationId = req.body.data.data.conversationId
    const conversationReturned = await getDriftApi(conversationApiBase, conversationId)
    const contactId = conversationReturned.contactId
    const contactReturned = await getDriftApi(contactsApiBase, contactId)
    const conversationTranscript = await getTranscript(conversationId)
    console.log('===TRANSCRIPT===')
    console.log(conversationTranscript)
    const contactEmail = contactReturned.attributes.email
    const contactFirstName = contactReturned.attributes.first_name
    const contactLastName = contactReturned.attributes.last_name
    //console.log('===contact===')
    //console.log(contactReturned)
    createMondayItem(contactFirstName, contactLastName, contactEmail, conversationTranscript)
})

//Helper Functions

//Single function to make GET requests to different Drift API points
function getDriftApi(APIbase, endpointId) {
    //CHANGE THIS TO AXIOS!!!
    return request
        .get(`${APIbase + endpointId}`)
        .set('Authorization', `Bearer ${DRIFT_TOKEN}`)
        .then(res => {
            return res.body.data
        })
        .catch(err => {
            console.log(err)
        });
}

function getTranscript(conversationId) {
    return axios
        .get("https://driftapi.com/conversations/" + conversationId + "/transcript", { headers: { "Authorization": `Bearer ${DRIFT_TOKEN}` } })
        .then(res => {
            return res.data
        })
}

function createMondayItem(contactFirstName, contactLastName, contactEmail, conversationTranscript) {
    let yourDate = new Date()
console.log(yourDate.toISOString().split('T')[0])
    const variables = ({
        boardId: 3169358815,
        itemName: `${contactFirstName} ${contactLastName}`,
        columnValues: JSON.stringify({
            email: { email: `${contactEmail}`, "text": `${contactEmail}` },
            text: "Drift",
            status: { "label": "New" },
            date4: { "date": new Date().toISOString().slice(0, 10)}
        })
    });

    axios({
        url: 'https://api.monday.com/v2',
        method: 'post',
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
            variables
        },
        headers: {
            'Authorization': MONDAY_AUTH_TOKEN,
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            console.log('new item id', result.data.data.create_item.id)
            const newItemId = result.data.data.create_item.id
            const updateVariables = ({
                item_id: newItemId
            });

            axios({
                url: 'https://api.monday.com/v2',
                method: 'post',
                data: {
                    query: `mutation{
                        create_update (item_id: ${newItemId}, body: ${JSON.stringify(conversationTranscript)}) {
                            id
                        }
                    }`
                },
                headers: {
                    'Authorization': MONDAY_AUTH_TOKEN,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    console.log('after create update')
                    console.log(res)
                })
                .catch(err => {
                    console.log('error', err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}