const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test phone', () => {
    it('should test valid', () => {
		let arg = {
			a: '+8 526 569-8900'
		};
		let [err, options] = new Validator()
		.with(arg).arg('a').required.phone.build();

		chai.expect(err).to.be.null;
		chai.expect(options.a).to.equal('+85265698900');
	});
});