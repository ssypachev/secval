const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test float validator", () => {
	it ("Should test simple string, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").build();
		
		chai.expect(options.a).to.equal("somestring");
		
	});
	
	it ("Should test simple string, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "somestring").required.string.build();
		
		chai.expect(options.a).to.equal("somestring");
		
	});
	
	it ("Should test simple string, min, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").min(7).build();
		
		chai.expect(options.a).to.equal("somestring");
		
		[err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").min(50).build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test simple string, max, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").max(50).build();
		
		chai.expect(options.a).to.equal("somestring");
		
		[err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").max(7).build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test simple string, between, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").min(7).max(50).build();
		
		chai.expect(options.a).to.equal("somestring");
		
		[err, options] = new Validator()
		.arg("a", "somestring").required.ofType("string").min(5).max(7).build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test simple string, trim, required", () => {
		
		let [err, options] = new Validator()
		.arg("a", "  somestring  ").required.ofType("string").trim.build();
		
		chai.expect(options.a).to.equal("somestring");
		
		[err, options] = new Validator()
		.arg("a", "  somestring  ").required.ofType("string").build();
		
		chai.expect(options.a).to.equal("  somestring  ");
	});
});
























