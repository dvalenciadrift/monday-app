const { getDriftApi } = require("./getDriftApi");
const { getTranscript } = require("./getTranscript");

const conversationApiBase = "https://driftapi.com/conversations/";
const contactsApiBase = "https://driftapi.com/contacts/";

const axios = require("axios");
const MONDAY_AUTH_TOKEN = process.env.MONDAY_AUTH_TOKEN;

const mainProcessor = async (conversationId) => {
	const conversationReturned = await getDriftApi(
		conversationApiBase,
		conversationId
	);
	console.log("Conversation Returned", conversationReturned);
	const contactId = conversationReturned.contactId;
	const contactReturned = await getDriftApi(contactsApiBase, contactId);
	const conversationTranscript = await getTranscript(conversationId);
	const contactEmail = contactReturned.attributes.email;
	const contactFirstName = contactReturned.attributes.first_name;
	const contactLastName = contactReturned.attributes.last_name;
	try {
		//Checking if Lead already exists
		axios({
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
		}).then((res) => {
			console.log("Query Leads ", res.data.data.items_by_column_values);
			if (res.data.data.items_by_column_values.length > 0) {
				console.log(
					`A lead with the email ${contactEmail} already exists. The name is ${res.data.data.items_by_column_values[0].name}`
				);
			} else {
				// Create new Item in Leads Board
				const variables = {
					boardId: 3169358815,
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
				})
					.then((result) => {
						//Adding Conversation Transcript as an update
						console.log("new item id", result.data.data.create_item.id);
						const newItemId = result.data.data.create_item.id;
						axios({
							url: "https://api.monday.com/v2",
							method: "post",
							data: {
								query: `mutation{
                        create_update (item_id: ${newItemId}, body: ${JSON.stringify(
									conversationTranscript
								)}) {
                            id
                        }
                    }`,
							},
							headers: {
								Authorization: MONDAY_AUTH_TOKEN,
								"Content-Type": "application/json",
							},
						})
							.then((res) => {
								console.log("Transcript added succesfully");
							})
							.catch((err) => {
								console.log("error", err);
							});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	} catch (err) {
		console.log("MainProcessor error: ");
		console.log(err);
	}
};

module.exports = {
	mainProcessor,
};
