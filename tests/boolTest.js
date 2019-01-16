const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test booleanean validator", () => {
	
	it ("Should test valid boolean, simple, required", () => {
		let arg = {
			a: true
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.true;
		
		arg = {
			a: false
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.false;
	});
	
	it ("Should test valid boolean alias, simple, required", () => {
		let arg = {
			a: true
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.boolean.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.true;
		
		arg = {
			a: false
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.boolean.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.false;
	});
	
	it ("Should test invalid boolean, simple, required", () => {
		let arg = {
			a: 123
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		console.log(err);
	});
	
	it ("Should test invalid optional boolean", () => {
		let arg = {
			b: true
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").optional.default("123").ofType("boolean").build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		console.log(err);
	});
	
	it ("Should test valid optional boolean", () => {
		let arg = {
			b: true
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").optional.default(false).ofType("boolean").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.be.false;
		console.log(err);
	});
	
	it ("Should test string boolean, simple, required", () => {
		let arg = {
			a: "true"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.true;
		
		arg = {
			a: "false"
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.false;
	});
	
	it ("Should test string boolean case insensitive, simple, required", () => {
		let arg = {
			a: "True"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").ignorecase.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.true;
		
		arg = {
			a: "FALSE"
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").ignorecase.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options.a).to.be.false;
	});
	
	it ("Should fail test string boolean on strict, simple, required", () => {
		let arg = {
			a: "True"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").strict.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		
		arg = {
			a: "true"
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").strict.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		
		arg = {
			a: true
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("boolean").strict.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
	});
	
	
});