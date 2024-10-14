 <p align ="center">
 Ticket bot by <a href="https://github.com/elbkr/ticket-bot">elbkr</a>
  </p>
  
##### Modified by [kirixen](https://github.com/kirixen)

## Features
- Multi guild!
- Open tickets by pressing a button
- Add and remove bot moderators
- Manage tickets by buttons or slash commands
- Manage ticket categories
- Send tickets history
- Log ticket actions
- Much more!

### Requirements
- Node v18 or higher
  
### Creating the application
1. Create an application in [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a BOT and Copy the BOT token
3. Enable all privileged gateway intents
4. Go to OAuth2 and copy the client ID
5. Paste the token at `TOKEN` line and the client ID  at `CLIENT_ID` line in `.env` file
6. Change `REPLACE_THIS` in the URL below with the client ID, and enter the link in your browser

https://discord.com/api/oauth2/authorize?client_id=REPLACE_THIS&permissions=8&scope=applications.commands%20bot

### Connecting to mongo DB
1. Login or register into [Mongo DB](https://account.mongodb.com/account/login)
2. Create a cluster and complete the configuration
3. Get the connection url by pressing on `connect < connect your application`
4. Replace the `password` with your database access password
5. Paste the URL into `.env` file  at `MONGO` line

*The URL looks like this:* `mongodb+srv://username:password@clusterName.pjxpv.mongodb.net/MyFirstDatabase?retryWrites=true&w=majority`

### Getting Pastebin API
1. Login or register into [pastebin](https://pastebin.com/login)
2. Get the api key on [here](https://pastebin.com/doc_api)
5. Paste the api key into `.env` file  at `PASTEBIN_API_KEY` line

### Changing ticket topics
1. Go to `src/events/interactions/buttonPress.js` file
2. Slide down to the line **127**
3. Change the objects (*See the example below*)
4. Don't forget to also change the topics in `src/commands/tickets/open.js` file

Object example:
```js
{
label: "This will show in the dropdown menu",
value: "value",
emoji: "<:emoji:emoji_id>" // or a simple emoji 🔇
}
```
- For more info on how to get custom emojis ID, check [this guide](https://www.youtube.com/watch?v=srUHwXnw1Jst) I found ;)

### .ENV Output
After the configuration, the `.env` file should look like this:
```env
TOKEN=SuPerReALToken.BelIeVe_Me_itS_ReaL
MONGO=mongodb+srv://username:password@clusterName.pjxpv.mongodb.net/MyFirstDatabase?retryWrites=true&w=majority
CLIENT_ID=521311050193436682
PASTEBIN_API_KEY=required
```

### Running the BOT
1. Open a terminal and run `npm install` or `npm i`
2. Run `node .`
