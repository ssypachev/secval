const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test array validator", () => {

    it ("Should test valid array", () => {
		let req = {
			body: {
			}
		};

		let [err, options] = new Validator().with(req.body)
			.arg('name').required.string
			.arg('currency').required.string.exactly(3).toUpperCase
			.arg('address').required.string
			.arg('description').required.string
			.arg('latitude').optional.float
			.arg('longitude').optional.float
			.arg('deviceId').required.string
			.compound.allOrNothing('latitude', 'longitude').build();
		
	});
	
});