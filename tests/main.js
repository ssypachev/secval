const chai = require('chai'),
	{ Validator } = require('../index.js');

describe("Basic tests", () => {
	
	it ("Should load", () => {
		const body = {
			a: 1
		}
		
		
		let a = new Validator().with(body)
		.arg("a").required.ofType("int")
		.arg("b", 5).optional.ofType("int")
		.trace()
		.build();
	});
	
});