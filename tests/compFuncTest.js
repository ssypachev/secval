const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test functional compounder', () => {
    it('should just create functional compounder', () => {
        let arg = {
            a: 100,
            b: 200,
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('a')
            .required.int.arg('b')
            .required.int.compound.message('Parameter b must be less than a')
            .func(['a', 'b'], (x, y) => {
                return x > y;
            })
            .build();
        chai.expect(err).not.to.be.null;
        console.log(err);
    });

    it('should throw err for func compounder with bad second argument', () => {
        let arg = {
            a: 100,
            b: 200,
        };
        let wasErr = false;
        try {
            new Validator()
                .with(arg)
                .arg('a')
                .required.int.arg('b')
                .required.int.compound.message('Parameter b must be less than a')
                .func(['a', 'b'], 'nyc mocha')
                .build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('should throw err for func compounder with bad first argument', () => {
        let arg = {
            a: 100,
            b: 200,
        };
        let wasErr = false;
        try {
            new Validator()
                .with(arg)
                .arg('a')
                .required.int.arg('b')
                .required.int.compound.message('Parameter b must be less than a')
                .func({ a: true, b: true }, null)
                .build();
        } catch (e) {
            wasErr = true;
        }
        chai.expect(wasErr).to.be.true;
    });

    it('should test nested variables', () => {
        let arg = {
            location: {
                latitude: 23.0,
                longitude: -121.0,
            },
        };
        let [err, options] = new Validator()
            .with(arg)
            .arg('location')
            .required.object.arg('latitude')
            .as('lat')
            .required.int.arg('longitude')
            .required.int.end.compound.func(['location.lat', 'location.longitude'], (x, y) => {
                return x === 23 && y == -121;
            })
            .build();
        chai.expect(err).to.be.null;
    });
});
