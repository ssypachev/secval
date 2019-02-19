const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test array validator', () => {
    it('Should test sort property', () => {
        let arg = {
            a: [1, 3, 2],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.sort()
            .build();

        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a).to.deep.equal([1, 2, 3]);
    });

    it('Should test sort function', () => {
        let arg = {
            a: ['1', '3', '2'],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.sort((a, b) => {
                return a < b ? -1 : 1;
            })
            .build();

        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a).to.deep.equal(['1', '2', '3']);
    });

    it('Should test sort non-function', () => {
        let arg = {
            a: [1, 3, 2],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.sort('some')
            .build();

        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a).to.deep.equal([1, 2, 3]);
    });

    it('Should test valid array', () => {
        let arg = {
            a: [1, 2, 3],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(3);
    });

    it('Should test valid array, min, max', () => {
        let arg = {
            a: [1, 2, 3],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.min(1)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(3);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.max(3)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(3);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.between(1, 3)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(3);

        let wasErr = false;
        try {
            [err, options] = new Validator()
                .with(arg)
                .arg('a')
                .required.array.between(3, 1)
                .build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('should test exact number of items in array', () => {
        let arg = {
            a: [1, 2, 3, 4, 5, 6, 7, 8],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.exactly(8)
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(8);
    });

    it('should throw err on signed exactly value', () => {
        let arg = {
            a: [1, 2, 3, 4, 5, 6, 7, 8],
        };
        let wasErr = false;
        try {
            let [err, options] = new Validator()
                .with(arg)
                .arg('a')
                .required.array.exactly(-1)
                .build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('should test exact number of items in invalid array', () => {
        let arg = {
            a: [1, 2, 3, 4, 5, 6, 7],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.exactly(8)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        console.log(err);
    });

    it('Should test invalid array, min, max', () => {
        let arg = {
            a: [1, 2, 3],
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.min(5)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        console.log(err);

        [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.max(1)
            .build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        console.log(err);
    });

    it('should test valid string array', () => {
        let arg = {
            a: '[1,2,3,4,5]',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.be.an('array');
        chai.expect(options.a.length).to.equal(5);
    });

    it('should test valid string array with strict mode', () => {
        let arg = {
            a: '[1,2,3,4]',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.strict.array.build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        console.log(err);
    });

    it('should test invalid string array', () => {
        let arg = {
            a: '[1,2,3,4,5',
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.array.build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;

        console.log(err);
    });
});
