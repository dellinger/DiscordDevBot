require('dotenv').config();
var Discord = require("discord.js");

export default class DiscordBot {

    supportedActions = {};

    constructor() {
        this.bot = new Discord.Client();
        this.basicActions = new BasicActions(this.bot);
		this.gambleActions = new GambleActions(this.bot);
        this.supportedActions["!help"] = this.listCommands;
        this.supportedActions["!listChannels"] = this.basicActions.listChannels;
        this.supportedActions["!ping"] = this.basicActions.pong;
        this.supportedActions["!roll"] = this.gambleActions.roll;
    };

    initialize = () => {
		this.authenticateBot();
		
        this.bot.on("ready", () => {
            console.log("Discord bot is ready!");
			this.supportedActions[`@${this.bot.user.username}`] = this.listCommands;
            console.log(`Supported Actions: ${Object.keys(this.supportedActions)}`);
        });

        this.bot.on("disconnected", () => {
            console.error("Discord bot disconnected :( ");
            process.exit(1);
        });

        this.bot.on("message", message => {
			let messageArray = message.cleanContent.split(" ");
            let potentialAction = messageArray[0];
			let temp = messageArray.splice(1);
            console.log(`Potential Action: ${potentialAction}`);
            if(this.isSupportedAction(potentialAction)) {
                let action = this.supportedActions[potentialAction];
                action(message,...temp);
            }
        });
    };

    listCommands = (message) => {
        this.bot.sendMessage(`This bot recognizes the following commands
                              ${Object.keys(this.supportedActions)}`);
    };

    isSupportedAction = (message) => {
        return this.supportedActions.hasOwnProperty(message);
    };

    authenticateBot = () => {
        let username = process.env.DISCORD_EMAIL;
        let password = process.env.DISCORD_PASSWORD;
        if(!username || !password) {
            throw new Error(`Username and Password for the discord account must be supplied in a .env file`);
        }
        console.info(`Authenticating with user ${username}`);
        this.bot.login(username, password);
    };
}
