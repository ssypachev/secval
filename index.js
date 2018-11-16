const ValidTypes = {
    "int": {
        description: "Integer"
    }
}

const checkMsg = (v, stdMsg) => {
    if (v.message) {
        return v.message;
    }
    return stdMsg;
}

/**
* Conveyor order
* 1. Type
* 2. Compound
* 3. Post for current argument
* 4. Post for overal data
*/
let Validator = function () {
    let self = this;

    const Validators = {
        "int": (v) => {
			let has = false;
            if (!/[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.name} must be int, but ${v.value} found`)];				
            }
			v.value = parseInt(v.value);
            if (v._unsigned && v.value < 0) {
                return [checkMsg(v, `Parameter ${v.name} must be unsigned, but ${v.value} found`)];
            }
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.name} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.name} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, v.value];
        },
        "float": (v) => {
            if (!/[+-]?([0-9]*[.])?[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.name} must be float, but ${v.value} found`)];
            }
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.name} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.name} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, parseFloat(v.value)];
        },
        "string": (v) => {
            let val = v.value.toString();
            if (v._trim) {
                val = val.trim();
            }
            if (v._min && val.length < v._min) {
                return [checkMsg(v, `Parameter ${v.name} must be greater than ${v._min} chars long, but ${v.value.length} chars found`)];
            }
            if (v._max && val.length > v._max) {
                return [checkMsg(v, `Parameter ${v.name} must be less than ${v._max} chars long, but ${v.value.length} chars found`)];
            }
            return [null, val];
        },
		"bool": (v) => {
			switch (typeof(v.value)) {
			case "boolean":
				return [null, v.value];
				break;
			case "string":
				let flags = v._strict ? "" : "i";				
				if (new RegExp("^(true|false)$", flags).test(v.value)) {
					return [null, JSON.parse(v.value.toLowerCase())];
				}
				break;
			}
			return [checkMsg(v, `Parameter ${v.name} must be boolean, hence true or false, but ${v.value} found`)];
		}
    };

    self.separator = ", ";

    //The set of objects to be validated
    self.args = {};
    //Current source. If defined, then arg1 will use _curSrc.
    self._curSrc = null;
    self.errs = [];
	self.options = {};

    self.arg1 = (name) => {
        if (self._curSrc === null) {
            throw new ReferenceError("Validator.arg(a). Current source wasn't defined. Please, first define source with 'with' method");
        }
        if (self.args.hasOwnProperty(name)) {
            throw new TypeError(`Validator.arg(a). Duplicated entry ${name}`);
        }

        const out = new Variable(self, name, self._curSrc[name]);
        self.args[name] = out;
        return out;
    }

    self.arg2 = (name, value) => {
        if (self.args.hasOwnProperty(name)) {
            throw new TypeError(`Validator.arg(a, b). Duplicated entry ${name}`);
        }
        const out = new Variable(self, name, value);
        self.args[name] = out;
        return out;
    }

    self.arg = function () {
        const argsLen = arguments.length;
        switch (argsLen) {
        case 1: //with source
            return self.arg1.apply(self, arguments);
            break;
        case 2: //name value
            return self.arg2.apply(self, arguments);
            break;
        default:
            throw new TypeError(`Validator.arg error. Method defined for 1 and 2 arguments, but ${argsLen} found`);
        }
    }

    self.with = (src) => {
        self._curSrc = src;
        return self;
    }

    self.trace = () => {
        console.log(self.args);
        return self;
    }

    self.build = () => {
        self.validateAll();
        if (self.errs.length > 0) {
            let textErr = [];
            self.errs.forEach((e) => {
                textErr.push(e);
            });
            return [textErr.join(self.separator), null];
        }
        return [null, self.options];
    };

    self.arguments = () => {
        return self.arguments;
    };

    self.validateAll = () => {
        Object.values(self.args).forEach((item) => {
            self.validate(item);
        });
    };

    self.validate = (v) => {
        if (v.type === null) {
            throw new TypeError("Can not validate untyped argument");
        }
		let err, result;
        if (v._optional) {
            if (v.value === null || v.value === undefined) {
                if (v._default != undefined && v._default !== null) {
                    v.value = v._default;
                }
            }
            [err, result] = Validators[v.type](v);
        } else {
			if (v.value === null || v.value === undefined) {
				err = `Parameter ${v.name} required, but nothing found`;
			} else {
				[err, result] = Validators[v.type](v);
			}
		}
		if (err !== null) {
			self.errs.push(err);
		}
		if (result !== null) {
			self.options[v.name] = result;
		}
    };
}

let Variable = function (parent, name, value) {
    let self = this;

    self.parent = parent;
    self.name   = name;
    self.value  = value;
    self.type   = null;
	
	/*
	self._min = null;
	self._max = null;
	self._unsigned = null;
	self._trim = null;
	self._strict = null;
	*/

    self.arg = self.parent.arg;

    self.build = () => {
        return self.parent.build();
    }
	
	self.with = self.parent.with;

    self.trace = () => {
        self.parent.trace();
        return self;
    }

    self.ofType = (typeName) => {
        switch (typeName.toLowerCase()) {
            case "int": case "string": case "float": case "datetime": case "date": case "time": case "bool": case "regexp":
                self.type = typeName;
                return self;
        }
        throw new TypeError(`Variable.ofType error [005]. type name ${typeName} not defined. Use int, string, float, datetime. date, time, bool, regexp`);
    }

    Object.defineProperty(self, "required", {
        get: () => {
            if (self._optional) {
                throw new TypeError(`Argument ${self.name} can not be both optional and required`);
            }
            self._required = true;
            return self;
        }
    });
    Object.defineProperty(self, "optional", {
        get: () => {
            if (self._required) {
                throw new TypeError(`Argument ${self.name} can not be both required and optional`);
            }
            self._optional = true;
            return self;
        }
    });
	["trim", "unsigned", "strict"].forEach(name => {
		Object.defineProperty(self, name, {
			get: () => {
				self[`_${name}`] = true;
				return self;
			}
		});
	});
	
    self.default = (value) => {
        self._default = value;
        return self;
    };
    self.between = (a, b) => {
		if (a >= b) {
			throw new TypeError(`Variable option 'between' error: first argument must be less than second argument, but ${a}, ${b} found`);
		}
        [self._min, self._max] = [a, b];
        return self;
    };
    self.min = (a) => {
        self._min = a;
        return self;
    };
    self.max = (b) => {
        self._max = b;
        return self;
    };
    self.func = (proc) => {
        self._func = proc;
        return self;
    };
    self.post = (proc) => {
        self._post = proc;
        return self;
    };
}

module.exports.Validator = Validator;




















