const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test boolean validator', () => {
	
	it ('Should test flag option, false', () => {
		let arg = {};
		let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.ofType('bool').flag
            .build();
		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('a', false);
	});
	
	it ('Should test flag option, true', () => {
		let arg = { a: null };
		let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.ofType('bool').flag
            .build();
		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('a', true);
	});
	
	it ('Should test flag option, true', () => {
		let arg = { a: true };
		let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.ofType('bool').flag
            .build();
		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('a', true);
	});
	
	it ('Should test flag option empty string, true', () => {
		let arg = { a: '' };
		let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.ofType('bool').flag
            .build();
		chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options).to.have.property('a', true);
	});
	
    it('Should test valid bool, simple, required', () => {
        let arg = {
            a: true,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.true;

        arg = {
            a: false,
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.false;
    });

    it('Should test valid bool alias, simple, required', () => {
        let arg = {
            a: true,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.bool.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.true;

        arg = {
            a: false,
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.bool.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.false;
    });

    it('Should test invalid bool, simple, required', () => {
        let arg = {
            a: 123,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
        console.log(err);
    });

    it('Should test invalid optional bool', () => {
        let arg = {
            b: true,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default('123')
            .ofType('bool')
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
        console.log(err);
    });

    it('Should test valid optional bool', () => {
        let arg = {
            b: true,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default(false)
            .ofType('bool')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options.a).to.be.false;
        console.log(err);
    });

    it('Should test string bool, simple, required', () => {
        let arg = {
            a: 'true',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.true;

        arg = {
            a: 'false',
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.false;
    });

    it('Should test string bool case insensitive, simple, required', () => {
        let arg = {
            a: 'True',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .ignorecase.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.true;

        arg = {
            a: 'FALSE',
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .ignorecase.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.false;
    });

    it('Should fail test string bool on strict, simple, required', () => {
        let arg = {
            a: 'True',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .strict.build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        arg = {
            a: 'true',
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .strict.build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        arg = {
            a: true,
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('bool')
            .strict.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
    });
});
