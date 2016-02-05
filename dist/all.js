"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

var BasicActions = function BasicActions(bot) {
    var _this = this;

    _classCallCheck(this, BasicActions);

    this.pong = function (message) {
        _this.bot.reply(message, "pong");
    };

    this.listChannels = function (message) {
        var channels = _this.bot.channels.map(function (channel) {
            return channel.name;
        });
        _this.bot.sendMessage(channels);
    };

    this.roll = function (message) {
        console.log(message);
        var val = Math.floor(Math.random() * 10) + 1;
        _this.bot.reply(message, "Rolled a " + val);
    };

    this.bot = bot;
};

exports.default = BasicActions;
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

    this.supportedActions = {};

    this.initialize = function () {
        _this.authenticateBot();

        _this.bot.on("ready", function () {
            console.log("Discord bot is ready!");
            _this.supportedActions["@" + _this.bot.user.username] = _this.listCommands;
            console.log("Supported Actions: " + Object.keys(_this.supportedActions));
        });

        _this.bot.on("disconnected", function () {
            console.error("Discord bot disconnected :( ");
            process.exit(1);
        });

        _this.bot.on("message", function (message) {
            var potentialAction = message.cleanContent;
            console.log("Potential Action: " + potentialAction);
            if (_this.isSupportedAction(potentialAction)) {
                var action = _this.supportedActions[potentialAction];
                action(message);
            }
        });
    };

    this.listCommands = function (message) {
        _this.bot.sendMessage("This bot recognizes the following commands\n                              " + Object.keys(_this.supportedActions));
    };

    this.isSupportedAction = function (message) {
        return _this.supportedActions.hasOwnProperty(message);
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

    this.bot = new Discord.Client();
    this.basicActions = new BasicActions(this.bot);
    this.supportedActions["!help"] = this.listCommands;
    this.supportedActions["!listChannels"] = this.basicActions.listChannels;
    this.supportedActions["!ping"] = this.basicActions.pong;
    this.supportedActions["!roll"] = this.basicActions.roll;
};

exports.default = DiscordBot;
"use strict";

var bot = new DiscordBot();
bot.initialize();
//# sourceMappingURL=all.js.map
