const chai = require('chai'),
    { Validator } = require('../index.js');

describe("Should test regexp validator", () => {

    it ("Should test valid", () => {
        let arg = {
            a: "letter"
        };
        let [err, options] = new Validator()
        .with(arg)
        .arg("a").required.regexp(/ett/i).build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal("letter");

        [err, options] = new Validator()
        .with(arg)
        .arg("a").required.ofType('regexp').operator(/ett/i).build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal("letter");
    });

    it ("Should test invalid", () => {
        let arg = {
            a: "apples"
        };
        let [err, options] = new Validator()
        .with(arg)
        .arg("a").required.regexp(/ett/i).build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });

    it ("Should test valid, with string validators", () => {
        let arg = {
            a: "letter"
        };
        let [err, options] = new Validator()
        .with(arg)
        .arg("a").required.regexp(/ett/i).min(1).max(10).build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal("letter");

        [err, options] = new Validator()
        .with(arg)
        .arg("a").required.regexp(/ett/i).between(1, 10).build();

        chai.expect(err).to.be.null;
        chai.expect(options).not.to.be.null;
        chai.expect(options.a).to.equal("letter");
    });

    it ("Should test invalid, with string validators", () => {
        let [err, options] = new Validator()
        .arg("a", "letter").required.regexp(/ett/i).min(100).build();

        chai.expect(err).not.to.be.null;
        chai.expect(options).to.be.null;
    });
	
	it ("Should post process regexp-ed value", () => {
		let arg = {
            a: "letter"
        };
        let [err, options] = new Validator()
        .with(arg)
        .arg("a").required.regexp(/ett/i).toUpperCase.build();
		
		chai.expect(options.a).to.equal('LETTER');
	});

});

















