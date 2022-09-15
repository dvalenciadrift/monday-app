# Monday.com Integration for Drift

Server side application written in Node that creates Items in Monday.com Boards after a Drift conversation ends.

### Application Logic

Whenever a Drift conversation ends, the application will look if the site visitor's email already exists in the Monday board. If it doesn't, so it will add the Lead as a new item in the board. Finally it will add the conversation transcript as an update for that item.

### Installation and Setup

#### Monday.com API

First, you will need access to a Monday.com account with API permissions. [Monday.com Dev Docs](https://developer.monday.com/api-reference/docs)

#### Drift Developer Applications

In order for Drift to expose data to the application we need to create one drift developer application with the appropriate scopes. [This guide](https://devdocs.drift.com/docs/quick-start) will walk you through setting an dev application up. You need to subscribe to the `conversation_push` webhook and enable the `conversation_read` scope.

#### Node and core dependencies

This project leverages core libraries/dependencies that are listed below:

- axios (https://www.npmjs.com/package/axios)
- body-parser (https://www.npmjs.com/package/body-parser)
- dotenv (https://www.npmjs.com/package/dotenv)
- express (https://www.npmjs.com/package/express)
- ngrok (https://www.npmjs.com/package/ngrok)
- node (https://nodejs.org/en/)
- npm (https://www.npmjs.com/package/npm)

#### Environment Variables

`DRIFT_TOKEN` - The Bearer Token generated when you installed the app to your Drift Org
`MONDAY_AUTH_TOKEN` - Monday.com API Authorization token
`BOARD_ID` - Monday.com Board ID where you want to save Contacts and Conversation records
`PORT` - For Development only - Port where you will start your server
`DEV_MODE` - Boolean to check if you are running Dev or Production mode
