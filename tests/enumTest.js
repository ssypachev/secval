const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test enum validator", () => {
	
	it ("Should test optional null", () => {
		let arg = {};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').optional.enumeration('a', 'b', 'c').build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
	});

    it ("Should test valid", () => {
		let [err, options] = new Validator()
		.arg("a", "one").required.enumeration("one", "two", "three").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal("one");
		
		[err, options] = new Validator()
		.arg("a", "two").required.enumeration(["one", "two", "three"]).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal("two");
		
		[err, options] = new Validator()
		.arg("a", "one").required.enumeration({"one": true, "two": true, "three": true}).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal("one");
		
		[err, options] = new Validator()
		.arg("a", "one").required.ofType("enum").operator({"one": true, "two": true, "three": true}).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal("one");
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.equal("one");
	});
	
	it ("Should test fail", () => {
		let [err, options] = new Validator()
		.arg("a", "five").required.enumeration("one", "two", "three").build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
});