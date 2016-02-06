var chai = require('chai'),
	expect = chai.expect,
	path = require('path');
var GambleActions = require('../src/GambleActions.js').default;

describe('GambleActions', function() {

	var gambleActions;
	beforeEach(function() {
		gambleActions = new GambleActions();
	});
	describe('isNormalInteger', function(){
		
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
		})
		
		
	})
	
});
