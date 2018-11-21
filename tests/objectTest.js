const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test object validator", () => {

    it ("Should not fail", () => {
		let arg = {
			a: {
				b: { 
					x: "123"
				},
				d: "12"
			},
			c: "lol"
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg("a").required.object
			.arg("b").required.object
				.arg("x").required.int
			.end
			.arg("d").required.int
		.end
		.arg("c").required.string
		.build();
		console.log(options);
	});
	
});