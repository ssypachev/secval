const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test as', () => {
    it('should rename simple', () => {
        let arg = {
            a: 100,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .as('b')
            .required.int.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.have.property('a');
        chai.expect(options).to.have.property('b');
        chai.expect(options.b).to.equal(100);
    });
    it('should rename nested', () => {
        let arg = {
            a: 100,
            b: {
                c: 'street',
            },
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .as('b')
            .required.int.arg('b')
            .as('internals')
            .object.arg('c')
            .required.string.build();

        chai.expect(err).to.be.null;
        chai.expect(options).to.deep.equal({
            b: 100,
            internals: {
                c: 'street',
            },
        });
    });
});
