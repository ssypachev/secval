const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test float validator', () => {
    it('Should test simple string, required', () => {
        let [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .build();

        chai.expect(options.a).to.equal('somestring');
    });

    it('Should test simple string, required', () => {
        let [err, options] = new Validator().arg('a', 'somestring').required.string.build();

        chai.expect(options.a).to.equal('somestring');
    });

    it('Should test exact', () => {
        let [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.string.exactly(3)
            .build();

        chai.expect(err).not.to.be.null;

        [err, options] = new Validator()
            .arg('a', 'lol')
            .required.string.exactly(3)
            .build();

        chai.expect(err).to.be.null;
    });

    it('Should test uppercase', () => {
        let [err, options] = new Validator().arg('a', 'somestring').required.string.uppercase.build();

        chai.expect(err).not.to.be.null;

        [err, options] = new Validator().arg('a', 'SOMESTRING').required.string.uppercase.build();

        chai.expect(err).to.be.null;
    });

    it('Should test lowercase', () => {
        let [err, options] = new Validator().arg('a', 'somestring').required.string.lowercase.build();

        chai.expect(err).to.be.null;

        [err, options] = new Validator().arg('a', 'SOMESTRING').required.string.lowercase.build();

        chai.expect(err).not.to.be.null;
    });

    it('Should test toLowerCase toUpperCase', () => {
        let [err, options] = new Validator().arg('a', 'somestring').required.string.toUpperCase.build();

        chai.expect(err).to.be.null;
        chai.expect(options.a).to.equal('SOMESTRING');

        [err, options] = new Validator().arg('a', 'loL').required.string.toLowerCase.build();

        chai.expect(options.a).to.equal('lol');
    });

    it('Should test simple string, min, required', () => {
        let [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .min(7)
            .build();

        chai.expect(options.a).to.equal('somestring');

        [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .min(50)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test simple string, max, required', () => {
        let [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .max(50)
            .build();

        chai.expect(options.a).to.equal('somestring');

        [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .max(7)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test simple string, between, required', () => {
        let [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .min(7)
            .max(50)
            .build();

        chai.expect(options.a).to.equal('somestring');

        [err, options] = new Validator()
            .arg('a', 'somestring')
            .required.ofType('string')
            .min(5)
            .max(7)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test simple string, trim, required', () => {
        let [err, options] = new Validator()
            .arg('a', '  somestring  ')
            .required.ofType('string')
            .trim.build();

        chai.expect(options.a).to.equal('somestring');

        [err, options] = new Validator()
            .arg('a', '  somestring  ')
            .required.ofType('string')
            .build();

        chai.expect(options.a).to.equal('  somestring  ');
    });

    it('should fail on strict', () => {
        let [err, options] = new Validator().arg('a', 123).required.string.strict.build();

        chai.expect(err).not.to.be.null;

        [err, options] = new Validator().arg('a', 123).required.string.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal('123');
    });
});
