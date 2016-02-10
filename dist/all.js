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
                console.log(potentialAction + " supported!");
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
    this.supportedActions["!1"] = this.gambleActions.register;
    this.supportedActions["!register"] = this.gambleActions.register;
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
				_this.bot.sendMessage(message.channel, "------ Gambling has started ------\n\n\t\t\t\t\t\t\t\t\t\t\t\t------ Bet is at " + _this.betAmount + " ------\n\n\t\t\t\t\t\t\t\t\t\t\t\t------ Registration ends in 3 minutes. Type !1 to enter.");
				_this.registrationOpen = true;
				//this.bot.sendMessage(message.channel,`------ Game will end in ${this.gameLength} minutes ------`);
				console.log("Bet Amount: " + _this.betAmount);
			} else {
				_this.bot.reply(message, "Gambling has not started. Use command !gamble *amount* *gamelengthInMins* ```!gamble [0-999999] [1-120]```");
			}
			setTimeout(function () {
				_this.bot.sendMessage(message.channel, "------ Registration has ended ------\n\t\t\t\t\t\t\t\t\t\t\t\t\tThe following players press !1  to roll");
				_this.bot.sendMessage(message.channel, Object.keys(_this.rolls));
				_this.registrationOpen = false;
				setTimeout(function () {
					_this.gameStarted = false;
					_this.bot.sendMessage(message.channel, "Time is up!");
					_this.calculateWinner(message);
				}, 60000 * _this.gameLength);
			}, 60000 * _this.registrationLength);
		};

		this.calculateWinner = function (message) {
			var min = Infinity,
			    max = -Infinity;

			for (var user in _this.rolls) {
				if (_this.rolls[user] < min) {
					min = user;
				}
				if (_this.rolls[user] > max) {
					max = user;
				}
			}
			_this.bot.sendMessage(message.channel, min + " owes " + (_this.rolls[max] - _this.rolls[min]) + " to " + max);
		};

		this.register = function (message, args) {
			if (_this.registrationOpen) {
				_this.rolls[message.author.username] = null;
				_this.bot.reply(message.channel, message.author.username + " is registered.");
			} else {
				_this.bot.reply(message.channel, "Registration is not open. Sorry.");
			}
		};

		this.roll = function (message, args) {
			if (_this.gameStarted) {
				if (_this.registrationOpen) {
					_this.bot.reply(message, "Please wait until registration finishes until performing a roll");
				} else {
					console.log("Roll command executed with " + _this.betAmount);
					var val = Math.floor(Math.random() * _this.betAmount) + 1;
					_this.bot.reply(message, "Rolled a " + val + " out of " + _this.betAmount);
					_this.rolls[message.author.username] = val;
				}
			} else {
				_this.bot.reply(message, "Gambling has not started. Use command ```!gamble [0-999999]```");
			}
		};

		this.bot = bot;
		this.gameStarted = false;
		this.registrationOpen = false;
		this.rolls = {}; // key: userid / amount rolled
		this.betAmount = 0;
		this.gameLength = 3; // in minutes
		this.registrationLength = 1; // in minutes
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
