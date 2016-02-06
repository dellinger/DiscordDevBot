var chai = require('chai'),
	expect = chai.expect,
	path = require('path'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai');

chai.use(sinonChai);

var GambleActions = require('../src/GambleActions.js').default;
import {describe, beforeEach, it} from 'mocha'; //TODO: Perhaps move everything to ES6 imports

describe('GambleActions', function() {

	var gambleActions,bot;
	beforeEach(()=>{
		bot = sinon.spy();
		bot.sendMessage = sinon.spy();
		
		gambleActions = new GambleActions(bot);
	});
	
	describe('calculateWinner', () => {
		
		it('bot sends message', () => {
			gambleActions.calculateWinner({channel: "Testchannel"});
			expect(bot.sendMessage).to.have.been.calledOnce;
		});
		
	});
	
	describe('isNormalInteger', () =>{
		var tests = [
			{args: ["5"], expected: true},
			{args: ["1"], expected: true},
			{args: ["999999"], expected: true},
			{args: ["0"], expected: false},
			{args: ["-1000"], expected: false}
		];
		tests.forEach((test) => {
			it(`should be ${test.expected} with a number of ${test.args}`, function() {
				var result = gambleActions.isNormalInteger.apply(null, test.args);
				expect(result).to.equal(test.expected);
			});
		});
	});
	
});
