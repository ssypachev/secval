const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test decimal", () => {
	
	/* 
		desired
		decimal(3,5).crop.pad.toDot
	*/
	it ("Should test valid", () => {
		let arg = {
			a: "123.456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).build();
		
		chai.expect(err).to.be.null;
	});
	
	it ("Should test valid, zero filled left", () => {
		let arg = {
			a: "00000123.456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).build();
		
		chai.expect(err).to.be.null;
	});
	
	it ("Should test valid, sign left", () => {
		let arg = {
			a: "+123.456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).build();
		
		chai.expect(err).to.be.null;
	});
	
	it ("Should test invalid", () => {
		let arg = {
			a: "123.4569"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test valid, post to comma", () => {
		let arg = {
			a: "123.456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).toComma.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal('123,456');
	});
	
	it ("Should test valid, post to dot", () => {
		let arg = {
			a: "123,456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).toDot.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal('123.456');
	});
	
	it ("Should test invalid, comma", () => {
		let arg = {
			a: "123.456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).comma.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test invalid, dot", () => {
		let arg = {
			a: "123,456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,3).dot.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test valid, pad end", () => {
		let arg = {
			a: "123,456"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.decimal(3,7).padEnd.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal("123,4560000");
	});
	
});

















