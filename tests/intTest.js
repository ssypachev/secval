const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test int validator", () => {
	
	it ("Should test undefined optional", () => {
		let arg = {};
		let [err, options] = new Validator()
		.with(arg).arg('a').optional.int.build();
		
		chai.expect(options).not.to.be.null;
		
		[err, options] = new Validator()
		.with(arg).arg('a').optional.default(35).int.build();
		
		chai.expect(options.a).to.equal(35);
		
		[err, options] = new Validator()
		.with(arg).arg('a').optional.default('beef').int.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test valid int, simple, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
	});
	
	it ("Should test strict int, simple, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.int.strict.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		
		arg = {
			a: "100500"
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.int.strict.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test valid int with alias, simple, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.int.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
	});
	
	it ("Should test invalid int with several custom messages, setSeparator", () => {
		let arg = {
			a: "a",
			b: "b"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").message("Aaa")
		.arg("b").required.ofType("int").message("Bbb")
		.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(err).to.equal("Aaa, Bbb");		
		
		[err, options] = new Validator().setSeparator(':').with(arg)
		.arg("a").required.ofType("int").message("Aaa")
		.arg("b").required.ofType("int").message("Bbb")
		.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(err).to.equal("Aaa:Bbb");		
	});
	
	it ("Should test valid int, simple, required, direct", () => {
		let [err, options] = new Validator()
		.arg("a", 100500).required.ofType("int").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
	});
	
	it ("Should test valid int, simple, default, optional", () => {
		let arg = {
			b: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").optional.default(300).ofType("int").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(300);
	});
	
	it ("Should test valid int, required, not set", () => {
		let arg = {
			b: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;	
	});
	
	it ("Should test valid int, min, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").min(3).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").min(300000).build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;
	});
	
	it ("Should test valid int, max, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").max(300000).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").max(10).build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;
	});
	
	it ("Should test valid int, between, required", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").between(10, 300000).build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").between(300000, 400000).build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;
		
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").between(10, 100).build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;
	});
	
	it ("Should test valid int, unsigned", () => {
		let arg = {
			a: 100500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").unsigned.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		
		arg = {
			a: -100500
		};
		[err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").unsigned.build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		chai.expect(options).to.be.null;
	});
	
	it ("Should test invalid int", () => {
		let arg = {
			a: "helloworld"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		console.log(err);
	});
	
	it ("Should test valid int string, simple, required", () => {
		let arg = {
			a: "100500"
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int").build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
	});
	
	it ("Should test several valid ints", () => {
		let arg = {
			a: 100500,
			b: 300,
			c: 500
		};
		let [err, options] = new Validator().with(arg)
		.arg("a").required.ofType("int")
		.arg("b").required.ofType("int")
		.arg("c").required.ofType("int")
		.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		chai.expect(options.b).to.be.an("number");
		chai.expect(options.b).to.equal(300);
		chai.expect(options.c).to.be.an("number");
		chai.expect(options.c).to.equal(500);
	});
	
	it ("Should test both direct and source int", () => {
		let arg1 = {
			a: 100500
		};
		let arg2 = {
			c: 500
		};
		let [err, options] = new Validator()
		.with(arg1)
		.arg("a").required.ofType("int")
		.arg("b", 300).required.ofType("int")
		.with(arg2)
		.arg("c").required.ofType("int")
		.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).to.have.property("a");
		chai.expect(options.a).to.be.an("number");
		chai.expect(options.a).to.equal(100500);
		chai.expect(options.b).to.be.an("number");
		chai.expect(options.b).to.equal(300);
		chai.expect(options.c).to.be.an("number");
		chai.expect(options.c).to.equal(500);
	});
});





















