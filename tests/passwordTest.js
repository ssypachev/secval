const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test password validator", () => {
	
	it ("Should test alphanumeric password", () => {
		let arg = {
			a: 'asd123a'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal(arg.a);
	});
	
	it ("Should test alphanumeric password, bad length", () => {
		let arg = {
			a: 'asd123a'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(10).password.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric password, bad password", () => {
		let arg = {
			a: 'asdqwea'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+lowerupper password", () => {
		let arg = {
			a: 'asdQ1wea'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal(arg.a);
	});
	
	it ("Should test alphanumeric+lowerupper password, bad password, no uppercase", () => {
		let arg = {
			a: 'asde1wea'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+lowerupper password, bad password, no lowercase", () => {
		let arg = {
			a: 'ASDE1WEA'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+lowerupper password, bad password, no number", () => {
		let arg = {
			a: 'ASDExWEA'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars password", () => {
		let arg = {
			a: 'qwe@1yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.specialchars.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal(arg.a);
	});
	
	it ("Should test alphanumeric+specialchars password, bad password, no specialchars", () => {
		let arg = {
			a: 'qwee1yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars password, bad password, no number", () => {
		let arg = {
			a: 'qwee@yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars+loweruppercase password", () => {
		let arg = {
			a: 'qwE1@yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.specialchars.build();
		
		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal(arg.a);
	});
	
	it ("Should test alphanumeric+specialchars+loweruppercase password, bad password, no uppercase", () => {
		let arg = {
			a: 'qwe1@yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars+loweruppercase password, bad password, no number", () => {
		let arg = {
			a: 'qwEX@yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars+loweruppercase password, bad password, no special chars", () => {
		let arg = {
			a: 'qwEX3yu'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
	it ("Should test alphanumeric+specialchars+loweruppercase password, bad password, no lowercase", () => {
		let arg = {
			a: '#WEX377'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.min(7).password.upperlower.specialchars.build();
		
		chai.expect(err).not.to.be.null;
	});
	
});
















