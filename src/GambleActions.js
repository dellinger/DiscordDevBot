require('dotenv').config();

export default class GambleActions {
	
	constructor(bot) {
		this.bot = bot;
		this.gameStarted = false;
		this.rolls = {}; // key: userid / amount rolled
		this.betAmount = 0;
		this.gameLength = 3; // in minutes
	}

	
	initiateGame = (message, ...args) => {

		console.log(`Args: ${args}`);
		if(args) {
			this.parseBet(args[0]);
			this.parseGameLength(args[1]);
			this.gameStarted = true;
			this.bot.sendMessage(message.channel,`------ Gambling has started ------`)
			this.bot.sendMessage(message.channel,`------ Bet is at ${this.betAmount} ------`);
			this.bot.sendMessage(message.channel,`------ Game will end in ${this.gameLength} minutes ------`);
			console.log(`Bet Amount: ${this.betAmount}`);
		} else {
			this.bot.reply(message, "Gambling has not started. Use command ```!gamble [0-999999]```");
		}
		setTimeout(()=> {
			console.log("Game has ended");
			this.gameStarted = false;
			this.bot.sendMessage(message.channel,`Time is up!`);
			this.calculateWinner(message);
		}, 60000 * this.gameLength)
	};
	
	calculateWinner = (message) => {

		let highestRoll = 0; //user / roll
		let highestUser = undefined;
		let lowestRoll = this.betAmount; // start high to get to lowest
		let lowestUser = undefined;

		Object.keys(this.rolls).forEach((username) => {
			if(this.rolls[username] > highestRoll) {
				highestRoll = this.rolls[username];
				highestUser = username;
			}
			if(this.rolls[username] < lowestRoll) {
				lowestRoll = this.rolls[username];
				lowestUser = username;
			}
		});
		if(highestUser && lowestUser) {
			this.bot.sendMessage(message.channel,`${lowestUser} owes ${highestRoll - lowestRoll} to ${highestUser}`);
		}


	};
	
	
	roll = (message, args) => {
		if(this.gameStarted) {
			console.log(`Roll command executed with ${this.betAmount}`);
			let val = Math.floor(Math.random() * this.betAmount) + 1;
			this.bot.reply(message,`Rolled a ${val} out of ${this.betAmount}`);
			this.rolls[message.author.username] = val;
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
