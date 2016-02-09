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

    this.bot = bot;
};

exports.default = BasicActions;
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();
var Discord = require("discord.js");

var DiscordBot = exports.DiscordBot = function DiscordBot() {
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
            console.log("Message: " + message.cleanContent);
            var messageArray = message.cleanContent.split(" ");
            var potentialAction = messageArray[0];
            var temp = messageArray.splice(1, messageArray.length);
            console.log("Temp: " + temp);
            console.log("Potential Action: " + potentialAction);
            if (_this.isSupportedAction(potentialAction)) {
                var action = _this.supportedActions[potentialAction];
                action.apply(undefined, [message].concat(_toConsumableArray(temp)));
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
    this.gambleActions = new GambleActions(this.bot);
    this.supportedActions["!help"] = this.listCommands;
    this.supportedActions["!listChannels"] = this.basicActions.listChannels;
    this.supportedActions["!ping"] = this.basicActions.pong;
    this.supportedActions["!gamble"] = this.gambleActions.initiateGame;
    this.supportedActions["!roll"] = this.gambleActions.roll;
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

var GambleActions = function () {
	function GambleActions(bot) {
		var _this = this;

		_classCallCheck(this, GambleActions);

		this.initiateGame = function (message) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			console.log("Args: " + args);
			if (args) {
				_this.parseBet(args[0]);
				_this.parseGameLength(args[1]);
				_this.gameStarted = true;
				_this.bot.sendMessage(message.channel, "------ Gambling has started ------");
				_this.bot.sendMessage(message.channel, "------ Bet is at " + _this.betAmount + " ------");
				_this.bot.sendMessage(message.channel, "------ Game will end in " + _this.gameLength + " minutes ------");
				console.log("Bet Amount: " + _this.betAmount);
			} else {
				_this.bot.reply(message, "Gambling has not started. Use command ```!gamble [0-999999]```");
			}
			setTimeout(function () {
				console.log("Game has ended");
				_this.gameStarted = false;
				_this.bot.sendMessage(message.channel, "Time is up!");
				_this.calculateWinner(message);
			}, 60000 * _this.gameLength);
		};

		this.calculateWinner = function (message) {

			var highestRoll = 0; //user / roll
			var highestUser = undefined;
			var lowestRoll = _this.betAmount; // start high to get to lowest
			var lowestUser = undefined;

			Object.keys(_this.rolls).forEach(function (username) {
				if (_this.rolls[username] > highestRoll) {
					highestRoll = _this.rolls[username];
					highestUser = username;
				}
				if (_this.rolls[username] < lowestRoll) {
					lowestRoll = _this.rolls[username];
					lowestUser = username;
				}
			});
			if (highestUser && lowestUser) {
				_this.bot.sendMessage(message.channel, lowestUser + " owes " + (highestRoll - lowestRoll) + " to " + highestUser);
			}
		};

		this.roll = function (message, args) {
			if (_this.gameStarted) {
				console.log("Roll command executed with " + _this.betAmount);
				var val = Math.floor(Math.random() * _this.betAmount) + 1;
				_this.bot.reply(message, "Rolled a " + val + " out of " + _this.betAmount);
				_this.rolls[message.author.username] = val;
			} else {
				_this.bot.reply(message, "Gambling has not started. Use command ```!gamble [0-999999]```");
			}
		};

		this.bot = bot;
		this.gameStarted = false;
		this.rolls = {}; // key: userid / amount rolled
		this.betAmount = 0;
		this.gameLength = 3; // in minutes
	}

	_createClass(GambleActions, [{
		key: "parseGameLength",
		value: function parseGameLength(num) {
			if (num && num > 0 && num < 120) {
				this.gameLength = num;
			} else {
				this.gameLength = 5;
			}
			console.log("Game Length is " + this.gameLength + " minutes");
		}
	}, {
		key: "parseBet",
		value: function parseBet(num) {
			if (this.isNormalInteger(num)) {
				this.betAmount = parseInt(num);
			}
		}
	}, {
		key: "isNormalInteger",
		value: function isNormalInteger(str) {
			return (/^\+?([1-9]\d*)$/.test(str)
			);
		}
	}]);

	return GambleActions;
}();

exports.default = GambleActions;
"use strict";

var bot = new DiscordBot();
bot.initialize();
//# sourceMappingURL=all.js.map
