const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test email validator", () => {
	
	it ("Should test valid", () => {
		let arg = {
			a: 'test@mail.com'
		};

		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.email.build();
		
		chai.expect(options.a).to.equal('test@mail.com');
		chai.expect(err).to.be.null;
	});
	
	it ("Should test invalid", () => {
		let arg = {
			a: 'local-ends-with-dot.@sld.com'
		};

		let [err, options] = new Validator()
		.with(arg)
		.arg('a').required.email.build();

		chai.expect(err).not.to.be.null;
	});
	
});