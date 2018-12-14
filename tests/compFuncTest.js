const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test functional compounder", () => {
	
	it ("should just create functional compounder", () => {
		let arg = {
			a: 100,
			b: 200
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg("a").required.int
		.arg("b").required.int
		.compound
		.message('Parameter b must be less than a')
		.func(["a", "b"], (x, y) => {
			return x > y;
		})
		.build();
		chai.expect(err).not.to.be.null;
		console.log(err);
	});
	
	it ("should test nested variables", () => {
		let arg = {
			location: {
				'latitude': 23.000,
				'longitude': -121.0
			}
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg('location').required.object
			.arg("latitude").as('lat').required.int
			.arg("longitude").required.int
		.end
		.compound
		.func(["location.lat", "location.longitude"], (x, y) => {
			return x === 23 && y == -121;
		})
		.build();
		chai.expect(err).to.be.null;
	});
	
});