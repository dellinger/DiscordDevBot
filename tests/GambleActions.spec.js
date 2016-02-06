var chai = require('chai'),
	expect = chai.expect,
	path = require('path');
var GambleActions = require('../src/GambleActions.js');

describe('GambleActions', function() {

	var gambleActions;
	beforeEach(function() {
		gambleActions = new GambleActions.default();
	});
	describe('isNormalInteger', function(){
		
		it("should be true with a number greater than 0", function() {
			var result = gambleActions.isNormalInteger("5");
			expect(result).to.equal(true);
		});
		
	})
	
});
