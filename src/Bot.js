require('dotenv').config();
var Discord = require("discord.js");

export default class DiscordBot {

    constructor() {
        this.bot = new Discord.Client();


    }

    initialize = () => {
        this.bot.on("ready", () => {
            console.log("Discord bot is ready!");
        });

        this.bot.on("disconnected", () => {
            console.error("Discord bot disconnected :( ");
        });

        this.bot.on("message", message => {
            if(message.content === "ping") {
                this.bot.reply(message, "pong");
            }
        });

        this.authenticateBot();
    };

    authenticateBot = () => {
        let username = process.env.DISCORD_USERNAME;
        let password = process.env.DISCORD_PASSWORD;
        if(!username || !password) {
            throw new Error(`Username and Password for the discord account must be supplied in a .env file`);
        }
        this.bot.login(username, password);
    };
}