const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test optional nullable', () => {
    it('Should test optional nullable', () => {
        let arg = {};
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.string.min(3)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        console.log(options);
    });

    it('Should test optional with invalida default', () => {
        let arg = {};
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default(false)
            .string.max(3)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
        console.log(err);
    });

    it('Should test optional with valid', () => {
        let arg = {
            a: 'hello',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default(false)
            .string.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal('hello');
        console.log(err);
    });
});
