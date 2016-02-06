require('dotenv').config();

export default class GambleActions {
	
	constructor(bot) {
		this.bot = bot;
		this.gameStarted = false;
		this.rolls = {}; // key: userid / amount rolled
		this.betAmount = 0;
	}

	
	initiateGame = (message, args) => {
		if(args) {
			if(this.isNormalInteger(args)){
				this.betAmount = parseInt(args);
				this.gameStarted = true;
			} else {
				console.log(`Need to enter a bet amount as an argument to initiate game`);
			}
			console.log(`Bet Amount: ${this.betAmount}`);
		}
		setTimeout(()=> {
			console.log("Game has ended");
			this.gameStarted = false;
			this.bot.sendMessage(`Time is up!`);
			this.calculateWinner(message);
		}, 5000)
	};
	
	calculateWinner = (message) => {
		this.bot.sendMessage(message.channel,`Congratulations! You are the winner! *PLACEHOLDER*`);
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

	isNormalInteger(str) {
		return /^\+?(0|[1-9]\d*)$/.test(str);
	}

}
