const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test compounder", () => {
	
	it ("should just create compounder", () => {
		let [err, options] = new Validator()
		.arg("a", 5).required.int.compound.build();
	});
	
	it ("should test any and atLeast compounder, win", () => {
		let arg = {
			
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg("a", 5).optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c").optional.default(100).int
		.compound
		.any('a', 'b', 'c')
		.build();
		
		chai.expect(err).to.be.null;
		
		[err, options] = new Validator()
		.with(arg)
		.arg("a", 5).optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c", 7).optional.default(100).int
		.compound
		.atLeast(2, 'a', 'b', 'c')
		.build();
		
		[err, options] = new Validator()
		.with(arg)
		.arg("a", 5).optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c", 7).optional.default(100).int
		.compound
		.exact(2, 'a', 'b', 'c')
		.build();
		
		chai.expect(err).to.be.null;
	});
	
	it ("should test any and atLeast compounder, fail", () => {
		let arg = {
			
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg("a").optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c").optional.default(100).int
		.compound
		.any('a', 'b', 'c')
		.build();
		
		chai.expect(err).not.to.be.null;
		
		[err, options] = new Validator()
		.with(arg)
		.arg("a").optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c", 7).optional.default(100).int
		.compound
		.atLeast(2, 'a', 'b', 'c')
		.build();
		
		chai.expect(err).not.to.be.null;
		
		[err, options] = new Validator()
		.with(arg)
		.arg("a").optional.default(100).int
		.arg("b").optional.default(100).int
		.arg("c", 7).optional.default(100).int
		.compound
		.exact(2, 'a', 'b', 'c')
		.build();
		
		chai.expect(err).not.to.be.null;
	});
	
});