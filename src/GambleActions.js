require('dotenv').config();

export default class GambleActions {
	
	constructor(bot) {
		this.bot = bot;
		this.gameStarted = false;
		this.registrationOpen = false;
		this.rolls = {}; // key: userid / amount rolled
		this.betAmount = 0;
		this.gameLength = 3; // in minutes
		this.registrationLength = 1; // in minutes
	}

	
	initiateGame = (message, ...args) => {

		console.log(`Args: ${args}`);
		if(args) {
			this.parseBet(args[0]);
			this.parseGameLength(args[1]);
			this.gameStarted = true;
			this.bot.sendMessage(message.channel,`------ Gambling has started ------\n
												------ Bet is at ${this.betAmount} ------\n
												------ Registration ends in 3 minutes. Type !1 to enter.`);
			this.registrationOpen = true;
			//this.bot.sendMessage(message.channel,`------ Game will end in ${this.gameLength} minutes ------`);
			console.log(`Bet Amount: ${this.betAmount}`);
		} else {
			this.bot.reply(message, "Gambling has not started. Use command !gamble *amount* *gamelengthInMins* ```!gamble [0-999999] [1-120]```");
		}
		setTimeout(()=> {
			this.bot.sendMessage(message.channel, `------ Registration has ended ------
													The following players press !1  to roll`);
			this.bot.sendMessage(message.channel, Object.keys(this.rolls));
			this.registrationOpen = false;
			setTimeout(() => {
				this.gameStarted = false;
				this.bot.sendMessage(message.channel,`Time is up!`);
				this.calculateWinner(message);
			}, 60000 * this.gameLength);
		}, 60000 * this.registrationLength)
	};
	
	calculateWinner = (message) => {
		var min = Infinity, max = -Infinity;

		for(var user in this.rolls) {
			if(this.rolls[user] < min) {
				min = user;
			}
			if(this.rolls[user] > max) {
				max = user;
			}
		}
		this.bot.sendMessage(message.channel,`${min} owes ${this.rolls[max] - this.rolls[min]} to ${max}`);
	};

	register = (message, args) => {
		if(this.registrationOpen) {
			this.rolls[message.author.username] = null;
			this.bot.reply(message.channel, `${message.author.username} is registered.`);
		} else {
			this.bot.reply(message.channel, "Registration is not open. Sorry.");
		}
	};
	
	
	roll = (message, args) => {
		if(this.gameStarted) {
			if(this.registrationOpen) {
				this.bot.reply(message, "Please wait until registration finishes until performing a roll");
			} else {
				console.log(`Roll command executed with ${this.betAmount}`);
				let val = Math.floor(Math.random() * this.betAmount) + 1;
				this.bot.reply(message,`Rolled a ${val} out of ${this.betAmount}`);
				this.rolls[message.author.username] = val;
			}

		} else {
			this.bot.reply(message, "Gambling has not started. Use command ```!gamble [0-999999]```");
		}
		
	};

	parseGameLength(num) {
		if(num && num > 0 && num < 120) {
			this.gameLength = num;
		} else {
			this.gameLength = 5;
		}
		console.log(`Game Length is ${this.gameLength} minutes`);
	}

	parseBet(num) {
		if(this.isNormalInteger(num)){
			this.betAmount = parseInt(num);
		}
	}

	isNormalInteger(str) {
		return /^\+?([1-9]\d*)$/.test(str);
	}

}
