const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test float validator", () => {
	
	it ("Should test simple float", () => { 
		let arg = {
			a: 12.34
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("float").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(12.34);
	});
	
	it ("Should test string simple float", () => { 
		let arg = {
			a: 12.34
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("float").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(12.34);
	});
	
});