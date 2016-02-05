require('dotenv').config();
var Discord = require("discord.js");

export default class DiscordBot {

    supportedActions = {};

    constructor() {
        this.bot = new Discord.Client();
        this.basicActions = new BasicActions(this.bot);
        this.supportedActions["!help"] = this.listCommands;
        this.supportedActions["!listChannels"] = this.basicActions.listChannels;
        this.supportedActions["!ping"] = this.basicActions.pong;
        this.supportedActions["!roll"] = this.basicActions.roll;
    };

    initialize = () => {
		this.authenticateBot();
		
        this.bot.on("ready", () => {
            console.log("Discord bot is ready!");
			this.supportedActions[this.bot.user.toString()] = this.listCommands();
        });

        this.bot.on("disconnected", () => {
            console.error("Discord bot disconnected :( ");
            process.exit(1);
        });

        this.bot.on("message", message => {
            if(this.isSupportedAction(message)) {
                this.supportedActions[message](message);
            }
        });
    };

    listCommands = () => {
        this.bot.sendMessage(`This bot recognizes the following commands
                              ${Object.keys(this.supportedActions)}`);
    };

    isSupportedAction = (message) => {
        console.log(`${message} is a supported action: ${this.supportedActions[message] ? true : false}`)
        return (this.supportedActions[message] ? true : false);
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
