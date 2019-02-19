const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test object validator', () => {
    it('Should not fail', () => {
        let arg = {
            a: {
                b: {
                    x: '123',
                },
                d: '12',
            },
            c: 'lol',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.object.arg('b')
            .required.object.arg('x')
            .required.int.end.arg('d')
            .required.int.end.arg('c')
            .required.string.build();

        chai.expect(options).not.to.be.null;
    });

    it('Should fail with bad type', () => {
        let arg = {
            a: {
                b: 'hello',
            },
        };

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.object.arg('b')
            .required.int.end.build();

        chai.expect(err).not.to.be.null;
        console.log(err);
    });

    it('Should fail with bad type', () => {
        let arg = {};

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.object.arg('b')
            .required.object.arg('c')
            .required.int.end.end.build();

        chai.expect(err).not.to.be.null;
        console.log(err);
    });

    it('Should win with optional', () => {
        let arg = {};

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default({
                b: '123',
            })
            .object.arg('b')
            .required.int.end.build();

        chai.expect(err).to.be.null;
        console.log(options);
    });

    it('Should win with optional not default', () => {
        let arg = {};

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.object.arg('b')
            .required.int.end.build();

        chai.expect(err).to.be.null;
    });

    it('Should fail with bad optional', () => {
        let arg = {};

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.default('tratatatatatatata')
            .object.arg('b')
            .required.int.end.build();

        chai.expect(err).not.to.be.null;
        console.log(err);
    });

    it('Should win with deep nested optional without default', () => {
        let arg = {};

        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .optional.object.arg('b')
            .required.int.end.build();

        chai.expect(err).to.be.null;
        console.log(err);
    });

    it('Should test full end when build', () => {
        let arg = {
            a: {
                b: {
                    x: '123',
                },
            },
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.object.arg('b')
            .required.object.arg('x')
            .required.int.build();
        console.log(options);
    });

    it('Should test with rename', () => {
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
            .as('q')
            .required.string.build();

        chai.expect(err).to.be.null;
        chai.expect(options).to.deep.equal({
            b: 100,
            internals: {
                q: 'street',
            },
        });
    });

    it('Should test rename', () => {
        let arg = {
            a: 100,
            b: {
                c: {
                    d: '100',
                },
            },
        };

        let v = new Validator()
            .with(arg)
            .arg('a')
            .as('b')
            .required.int.arg('b')
            .as('internals')
            .required.object.arg('c')
            .as('q')
            .required.object.arg('d')
            .as('q').required.string.end.end;

        let [err, options] = v.build();

        chai.expect(v.gmap).have.property('a');
        chai.expect(v.gmap).have.property('b');
        chai.expect(v.gmap).have.property('internals');
        chai.expect(v.gmap).have.property('internals.c');
        chai.expect(v.gmap).have.property('internals.q');

        chai.expect(err).to.be.null;
        chai.expect(options).to.deep.equal({
            b: 100,
            internals: {
                q: {
                    q: '100',
                },
            },
        });
    });
});
