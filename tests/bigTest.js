const chai = require('chai'),
    { Validator } = require('../index.js');

describe('Should test array validator', () => {
    it('Should test empty object with preprocessors and postprocessors', () => {
        let req = {
            body: {},
        };

        let [err, options] = new Validator()
            .with(req.body)
            .arg('name')
            .required.string.arg('currency')
            .required.trim.string.exactly(3)
            .toUpperCase.arg('address')
            .required.string.arg('description')
            .required.string.arg('latitude')
            .optional.float.arg('longitude')
            .optional.float.arg('deviceId')
            .required.string.compound.allOrNothing('latitude', 'longitude')
            .build();

        chai.expect(err).not.to.be.null;
    });

    it('Should test empty object with default values', () => {
        let req = {
            body: {},
        };
        let [err, options] = new Validator()
            .with(req.body)
            .arg('name')
            .optional.string.arg('currency')
            .optional.trim.string.default('RUB')
            .exactly(3)
            .toUpperCase.arg('address')
            .optional.string.arg('description')
            .optional.string.arg('latitude')
            .optional.float.arg('longitude')
            .optional.float.arg('settings')
            .optional.object.arg('a')
            .optional.int.default(100)
            .end.arg('deviceId')
            .optional.string.compound.allOrNothing('latitude', 'longitude')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).to.have.property('currency');
        chai.expect(options.currency).to.equal('RUB');
        chai.expect(options).not.to.have.property('settings');
    });

    it('Should test empty object with default values', () => {
        let req = {
            body: {},
        };
        let [err, options] = new Validator()
            .with(req.body)
            .arg('name')
            .optional.string.arg('currency')
            .optional.trim.string.default('RUB')
            .exactly(3)
            .toUpperCase.arg('address')
            .optional.string.arg('description')
            .optional.string.arg('latitude')
            .optional.float.arg('longitude')
            .optional.float.arg('settings')
            .optional.default({})
            .object.arg('a')
            .optional.int.default(100)
            .end.arg('deviceId')
            .optional.string.compound.allOrNothing('latitude', 'longitude')
            .build();

        chai.expect(err).to.be.null;
        chai.expect(options).to.have.property('currency');
        chai.expect(options.currency).to.equal('RUB');
        chai.expect(options).to.have.property('settings');
        chai.expect(options.settings.a).to.equal(100);

        console.log(options);
    });
});
