const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test but', () => {
    it('Should test but works and substitute single variable', () => {
		let arg = {
			status: 'any'
		};
		let [err, options] = new Validator()
            .with(arg)
            .arg('status')
            .required.string.but('any', 'processed')
            .build();

		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('status', 'processed');
	});
	
	it('Should test but works and substitute array variable', () => {
		let arg = {
			status: 'any'
		};
		let [err, options] = new Validator()
            .with(arg)
            .arg('status')
            .required.string.but(['any', 'all'], 'processed')
            .build();

		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('status', 'processed');
	});
	
	it('Should test simultaneous but', () => {
		let arg = {
			status: 'any'
		};
		let [err, options] = new Validator()
            .with(arg)
            .arg('status')
            .required.string.but('any', null).but('all', null)
            .build();

		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('status', null);
	});
});













