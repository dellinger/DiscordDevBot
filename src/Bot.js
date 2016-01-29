require('dotenv').config();
var Discord = require("discord.js");

export default class DiscordBot {

    constructor() {
        this.bot = new Discord.Client();
    }

    initialize = () => {
        this.bot.on("ready", () => {
            console.log("Discord bot is ready!");
            this.listChannels();
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
        let username = process.env.DISCORD_EMAIL;
        let password = process.env.DISCORD_PASSWORD;
        if(!username || !password) {
            throw new Error(`Username and Password for the discord account must be supplied in a .env file`);
        }
        console.info(`Authenticating with user ${username}`);
        this.bot.login(username, password);
    };

    listChannels = () => {
        console.log(`User is subscribed to these channels: ${this.bot.channels} `);
    };
}