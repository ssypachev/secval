const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test any validator", () => {
	
	it ("Should test", () => {
		let [err, options] = new Validator()
		.arg('a', ["a", 1, {}]).required.any.build();
		
		chai.expect(options.a).to.deep.equal(["a", 1, {}]);
	});
	
	it ("Should use defule any type", () => {
		let [err, options] = new Validator()
		.arg('a', ["a", 1, {}]).required.build();
		
		chai.expect(options.a).to.deep.equal(["a", 1, {}]);
	});
	
	it ("Should fail on required", () => {
		let arg = {};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.any.build();
		
		chai.expect(err).not.to.be.null;
	});
	
});