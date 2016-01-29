require('dotenv').config();
var Discord = require("discord.js");

export default class DiscordBot {

    supportedActions = {};

    constructor() {
        this.bot = new Discord.Client();
        this.basicActions = new BasicActions(this.bot);
        this.supportedActions["ping"] = this.basicActions.pong;
        this.supportedActions["roll"] = this.basicActions.roll;
        this.supportedActions["listchannels"] = this.basicActions.listChannels();
        this.supportedActions["listCommands"] = this.listCommands();
    };

    initialize = () => {
        this.bot.on("ready", () => {
            console.log("Discord bot is ready!");
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

        this.authenticateBot();
    };

    isSupportedAction = (message) => {
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

    listCommands = () => {
        this.bot.sendMessage(`This bot recognizes the following commands
                              ${Object.keys(this.supportedActions)}`);
    };


}