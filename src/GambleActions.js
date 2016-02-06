require('dotenv').config();

export default class GambleActions {

	constructor(bot) {
		this.bot = bot;
	}

	roll = (message) => {
		//  break apart message
		console.log(message);
		let val = Math.floor(Math.random() * 10) + 1;
		this.bot.reply(message,`Rolled a ${val}`);
	};
}
