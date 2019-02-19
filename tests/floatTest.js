const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test float validator', () => {
    it('Should test simple float', () => {
        let arg = {
            a: 12.34,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);
    });

    it('Should test simple float alias', () => {
        let arg = {
            a: 12.34,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.float.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);
    });

    it('Should test simple strict float alias', () => {
        let arg = {
            a: 12.34,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.strict.float.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);

        arg = {
            a: '12.34',
        };
        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.strict.float.build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test string simple float', () => {
        let arg = {
            a: '12.34',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);
    });

    it('Should fail simple float', () => {
        let arg = {
            a: 'helloworld',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should fail simple optional float', () => {
        let arg = {
            b: 'helloworld',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default('some')
            .ofType('float')
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test simple optional float', () => {
        let arg = {
            b: 'helloworld',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default(-13.24)
            .ofType('float')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(-13.24);
    });

    it('Should test float, max', () => {
        let arg = {
            a: '12.34',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .max(15)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .max(10)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test float, min', () => {
        let arg = {
            a: '12.34',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .min(10)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .min(15)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it('Should test float, between', () => {
        let arg = {
            a: '12.34',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .between(1, 15)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal(12.34);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.ofType('float')
            .between(1, 2)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });
});
