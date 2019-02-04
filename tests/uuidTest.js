const uuid4 = require ('uuid/v4'),
	  uuid1 = require ('uuid/v1'),
	  uuid5 = require ('uuid/v5'),
	  uuid3 = require ('uuid/v3');

const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test uuid validators", () => {
	
	it ("Should test uuid with bad string options", () => {
		let x = uuid4();
		let [err, options] = new Validator()
		.arg('u', x).required.uuid.v4.max(10).build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test uuid v4", () => {
		
		for (let i = 0; i < 100; i++) {
			let x = uuid4();
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.v4.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
	});
	
	it ("Should test uuid v4 post-processing", () => {
		
		let x = uuid4();
		let [err, options] = new Validator()
		.arg('u', x).required.uuid.v4.toUpperCase.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.u).to.equal(x.toUpperCase());
		
	});
	
	it ("Should test uuid v1", () => {
		
		for (let i = 0; i < 100; i++) {
			let x = uuid1();
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.v1.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
	});
	
	it ("Should test uuid v3", () => {
		
		for (let i = 0; i < 100; i++) {
			let x = uuid3('www.badcode.com', uuid3.DNS);
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.v3.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
	});
	
	it ("Should test uuid v5", () => {
		
		for (let i = 0; i < 100; i++) {
			let x = uuid5('https://www.badcode.com', uuid3.URL);
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.v5.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
	});
	
	it ("Should test any uuid", () => {
		
		for (let i = 0; i < 25; i++) {
			let x = uuid5('https://www.badcode.com', uuid3.URL);
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
		for (let i = 0; i < 25; i++) {
			let x = uuid3('www.badcode.com', uuid3.DNS);
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
		for (let i = 0; i < 25; i++) {
			let x = uuid1();
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
		for (let i = 0; i < 25; i++) {
			let x = uuid1();
			let [err, options] = new Validator()
			.arg('u', x).required.uuid.build();
			
			chai.expect(err).to.be.null;
			chai.expect(options.u).to.equal(x);
		}
		
	});
	
	it ("Should fail", () => {
		let [err, options] = new Validator()
		.arg('u', 123).required.uuid.v1.build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
		
		[err, options] = new Validator()
		.arg('u', 123).required.uuid.build();
		
		chai.expect(err).not.to.be.null;
		console.log(err);
	});
	
});











