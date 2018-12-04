const chai = require('chai'),
      moment = require('moment'),
    { Validator } = require('../index.js');

describe("Should test datetime validator", () => {
	
	it ("Should return moment object", () => {
		let arg = {
			d: "2018-04-04 00:11:22"
		};
		let [err, options] = new Validator()
		.with(arg).arg('d').datetime.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options).to.have.property('d');
		chai.expect(options.d).to.be.instanceof(moment);
	});
	
	it ("Should return js Date object", () => {
		let arg = {
			d: "2018-04-04 00:11:22"
		};
		let [err, options] = new Validator()
		.with(arg).arg('d').datetime.js.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		chai.expect(options).to.have.property('d');
		chai.expect(options.d).to.be.instanceof(Date);
	});
	
	it ("Should test min", () => {
		let arg = {
			d: "2018-04-04 00:11:22"
		};
		let [err, options] = new Validator()
		.with(arg).arg('d').datetime.js.min('2018-03-04 00:11:22').build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		
		[err, options] = new Validator()
		.with(arg).arg('d').datetime.js.min('2018-05-04 00:11:22').build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test max", () => {
		let arg = {
			d: "2018-04-04 00:11:22"
		};
		let [err, options] = new Validator()
		.with(arg).arg('d').datetime.js.max('2018-05-04 00:11:22').build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
		
		[err, options] = new Validator()
		.with(arg).arg('d').datetime.js.max('2018-03-04 00:11:22').build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
	});
	
	it ("Should test format", () => {
		let arg = {
			d: "2018-04-04 00:11:22"
		};
		let [err, options] = new Validator()
		.with(arg).arg('d').datetime.format('YY-MM-DD').js.build();
		
		chai.expect(err).not.to.be.null;
		chai.expect(options).to.be.null;
		
		[err, options] = new Validator()
		.with(arg).arg('d').datetime.js.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options).not.to.be.null;
	});
	
});















