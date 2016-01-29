"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();
var Discord = require("discord.js");

var DiscordBot = function DiscordBot() {
    var _this = this;

    _classCallCheck(this, DiscordBot);

    this.initialize = function () {
        _this.bot.on("ready", function () {
            console.log("Discord bot is ready!");
            _this.listChannels();
        });

        _this.bot.on("disconnected", function () {
            console.error("Discord bot disconnected :( ");
        });

        _this.bot.on("message", function (message) {
            if (message.content === "ping") {
                _this.bot.reply(message, "pong");
            }
        });

        _this.authenticateBot();
    };

    this.authenticateBot = function () {
        var username = process.env.DISCORD_EMAIL;
        var password = process.env.DISCORD_PASSWORD;
        if (!username || !password) {
            throw new Error("Username and Password for the discord account must be supplied in a .env file");
        }
        console.info("Authenticating with user " + username);
        _this.bot.login(username, password);
    };

    this.listChannels = function () {
        console.log("User is subscribed to these channels: " + _this.bot.channels + " ");
    };

    this.bot = new Discord.Client();
};

exports.default = DiscordBot;
"use strict";

var bot = new DiscordBot();
bot.initialize();
//# sourceMappingURL=all.js.map
