const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test in-depth object", () => {
	
	it.skip("Should create simple instance", () => {
		
		let arg = {
			a: "123",
			b: {
				"c": "helloworld",
				d: 123,
				e: {
					f: "12.34"
				}
			},
			g: {
				h: "some"
			}
		}
		
		let [err, options] = new Validator()
		.with(arg)
		.arg("a").required.int
		.arg("b").required.object.build();
		
	});
	
});