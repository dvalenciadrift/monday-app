const { getDriftApi } = require("./getDriftApi");
const { getTranscript } = require("./getTranscript");
const { leadExists } = require("./leadExists");
const { mondayNewItem } = require("./mondayNewItem");

const conversationApiBase = "https://driftapi.com/conversations/";
const contactsApiBase = "https://driftapi.com/contacts/";

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
		leadExists(contactEmail).then((res) => {
			console.log("Query Leads ", res.data.data.items_by_column_values);
			if (res.data.data.items_by_column_values.length > 0) {
				console.log(
					`A lead with the email ${contactEmail} already exists. The name is ${res.data.data.items_by_column_values[0].name}`
				);
			} else {
				// Create new Item in Leads Board
				mondayNewItem(contactFirstName, contactLastName, contactEmail)
					.then((result) => {
						//Adding Conversation Transcript as an update
						console.log("new item id", result.data.data.create_item.id);
						const newItemId = result.data.data.create_item.id;
						addConversationTranscript(newItemId, conversationTranscript)
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
