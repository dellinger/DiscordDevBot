require('dotenv').config();

export default class BasicActions {

    constructor(bot) {
        this.bot = bot;
    }

    pong = (message) => {
        this.bot.reply(message, "pong");
    };

    listChannels = (message) => {
        let channels = this.bot.channels.map((channel) => {
            return channel.name;
        });
        this.bot.sendMessage(channels);
    };

    roll = (message) => {
        console.log(message);
        let val = Math.floor(Math.random() * 10) + 1;
        this.bot.reply(message,`Rolled a ${val}`);
    };
}