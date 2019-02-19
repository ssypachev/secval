const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test any validator', () => {
    it('Should test omit pass through to child validator', () => {
        let v = new Validator({
            omit: true,
        });
        let w = v.with({ a: { b: 'tmp' } }).arg('a').object;
    });

    it('Should throw on undefined source', () => {
        let wasErr = false;
        let arg = {};
        try {
            new Validator().arg('a').required.int.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should throw on duplicate entry arg1', () => {
        let wasErr = false;
        let arg = {};
        try {
            new Validator()
                .with(arg)
                .arg('a')
                .arg('a')
                .required.int.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should throw on duplicate entry arg2', () => {
        let wasErr = false;
        try {
            new Validator()
                .arg('a', 1)
                .arg('a', 2)
                .required.int.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should throw on bad number of arg arguments (>2)', () => {
        let wasErr = false;
        try {
            new Validator().arg('a', 'b', 'c').required.int.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should throw on bad number of arg arguments (0)', () => {
        let wasErr = false;
        try {
            new Validator().arg().required.int.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should test trace', () => {
        new Validator()
            .arg('a', 1)
            .required.int.trace()
            .build();
    });

    it('Should test err for undefined type', () => {
        let wasErr = false;
        try {
            new Validator()
                .arg('a', 1)
                .required.ofType('nyc mocha')
                .build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should test err for both required and optional', () => {
        let wasErr = false;
        try {
            new Validator().arg('a', 1).required.optional.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;

        wasErr = false;

        wasErr = false;
        try {
            new Validator().arg('a', 1).optional.required.build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('Should test', () => {
        let [err, options] = new Validator().arg('a', ['a', 1, {}]).required.any.build();

        chai.expect(options.a).to.deep.equal(['a', 1, {}]);
    });

    it('Should use defule any type', () => {
        let [err, options] = new Validator().arg('a', ['a', 1, {}]).required.build();

        chai.expect(options.a).to.deep.equal(['a', 1, {}]);
    });

    it('Should fail on required', () => {
        let arg = {};
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.any.build();

        chai.expect(err).not.to.be.null;
    });
});
