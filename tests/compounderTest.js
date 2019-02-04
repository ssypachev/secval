const chai = require('chai'),
	{ Validator } = require('../index.js');
	
describe("Should test compounder", () => {
	
	it ("should just create compounder", () => {
		let [err, options] = new Validator()
		.arg("a", 5).required.int.compound.build();
	});
	
	it ("should test allornothing compounder", () => {
		let arg = {
			a: 1,
			b: 2,
			c: 3
		};
		let [err, options] = new Validator()
		.with(arg)
		.arg("a").optional.int
		.arg("b").optional.int
		.arg("c").optional.int
		.compound
		.allOrNothing("a", "b", "c")
		.build();
		
		chai.expect(err).to.be.null;
		
		arg = {
			
		};
		[err, options] = new Validator()
		.with(arg)
		.arg("a").optional.int
		.arg("b").optional.int
		.arg("c").optional.int
		.compound
		.allOrNothing("a", "b", "c")
		.build();
		
		chai.expect(err).to.be.null;
		
		[err, options] = new Validator()
		.with(arg)
		.arg("a").optional.int
		.arg("b").optional.int
		.arg("c").optional.int
		.compound
		.allOrNothing(["a", "b", "c"])
		.build();
		
		chai.expect(err).to.be.null;
		
		arg = {
			a: 1
		};
		[err, options] = new Validator()
		.with(arg)
		.arg("a").optional.int
		.arg("b").optional.int
		.arg("c").optional.int
		.compound
		.allOrNothing("a", "b", "c")
		.build();
		
		chai.expect(err).not.to.be.null;
		
		let flag = false;
		try {
			[err, options] = new Validator()
			.with(arg)
			.arg("a").optional.int
			.arg("b").optional.int
			.arg("c").optional.int
			.compound
			.allOrNothing("a")
			.build();
		} catch (err) {
			flag = true;
		}
		chai.expect(flag).to.be.true;
		
		flag = false;
		try {
			[err, options] = new Validator()
			.with(arg)
			.arg("a").optional.int
			.arg("b").optional.int
			.arg("c").optional.int
			.compound
			.allOrNothing(["a"])
			.build();
		} catch (err) {
			flag = true;
		}
		chai.expect(flag).to.be.true;
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
	
	it ("Should throw err on exact with bad args", () => {
		let arg = {
			
		};
		let wasErr = false;
		try {
			new Validator()
			.with(arg)
			.arg("a", 5).optional.default(100).int
			.arg("b").optional.default(100).int
			.arg("c", 7).optional.default(100).int
			.compound
			.exact(5, 'a', 'b', 'c')
			.build();
		} catch (e) {
			wasErr = true;
		}
		chai.expect(wasErr).to.be.true;
	});
	
	it ("should test atLeast compounder, throw err on bad arguments", () => {
		let arg = {
			
		};
		let wasErr = false;
		try {
			new Validator()
				.with(arg)
				.arg("a").optional.default(100).int
				.arg("b").optional.default(100).int
				.arg("c", 7).optional.default(100).int
				.compound
				.atLeast(7, 'a', 'b', 'c')
				.build();
		} catch (e) {
			wasErr = true;
		}
		chai.expect(wasErr).to.be.true;
	});
	
	it ("Should test ifArgSet with bad set of arguments", () => {
		let arg = {
			
		};
		let wasErr = false;
		try {
			new Validator()
				.with(arg)
				.arg("a").optional.default(100).int
				.arg("b").optional.default(100).int
				.compound
				.any('a', 'b', 'c')
				.build();
		} catch (e) {
			wasErr = true;
		}
		chai.expect(wasErr).to.be.true;
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
	
	it ("should test nested compounder", () => {
		let [err, options] = new Validator()
		.with({
			location: {
				longitude: 12.12
			}
		}).arg('location').object
		    .arg('latitude').optional.float
		    .arg('longitude').optional.float
		.end
		.compound.allOrNothing('location.latitude', 'location.longitude')
		.build();
		
		chai.expect(err).not.to.be.null;
	});
	
});











