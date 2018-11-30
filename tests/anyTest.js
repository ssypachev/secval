const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test any validator", () => {
	
	it ("Should test", () => {
		let [err, options] = new Validator()
		.arg('a', ["a", 1, {}]).required.any.build();
	});
	
});