const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test func validator", () => {
	
	it ("Should fail with undefined operator", () => {
		let [err, options] = new Validator()
		.arg("a", 2).required.ofType("func").message("Value must be even").build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test simple func", () => {
		let [err, options] = new Validator()
		.arg("a", 2).required.ofType((a) => {
			return a % 2 == 0;
		}).message("Value must be even").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(2);
		
		[err, options] = new Validator()
		.arg("a", 3).required.ofType((a) => {
			return a % 2 == 0;
		}).message("Value must be even").build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(err).to.equal("Value must be even");
		chai.expect(options).to.be.null;
	});
	
	it ("Should test simple func with operator method", () => {
		let [err, options] = new Validator()
		.arg("a", 2).required.ofType("func")
			.operator((a) => {
				return a % 2 == 0;
			}).message("Value must be even").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(2);
	});
	
	it ("Should test simple func with argument", () => {
		let [err, options] = new Validator()
		.arg("a", 2).required.func((a) => {
				return a % 2 == 0;
			}).message("Value must be even").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(2);
	});
	
	it ("Should test simple func alias with operator method", () => {
		let [err, options] = new Validator()
		.arg("a", 2).required.func()
			.operator((a) => {
				return a % 2 == 0;
			}).message("Value must be even").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal(2);
	});
	
});