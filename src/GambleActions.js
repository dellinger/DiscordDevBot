require('dotenv').config();

export default class GambleActions {

	constructor(bot) {
		this.bot = bot;
	}

	roll = (message, args) => {
		//  break apart message
		
		let rollAmount = args;
		if(this.isNormalInteger(rollAmount)) {
			rollAmount = parseInt(rollAmount);
		} else {
			rollAmount = 5000; // Arbitrary at this point
		}
		console.log(`Roll command executed with ${rollAmount}`);
		let val = Math.floor(Math.random() * rollAmount) + 1;
		this.bot.reply(message,`Rolled a ${val} out of ${rollAmount}`);
	};

	isNormalInteger(str) {
		return /^\+?(0|[1-9]\d*)$/.test(str);
	}

}
