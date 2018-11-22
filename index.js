const checkMsg = (v, stdMsg) => {
    if (v._message) {
        return v._message;
    }
    return stdMsg;
}

let globalOptions = {
    separator: ", "
};

const array2set = (arr) => {
	let out = {};
	arr.forEach(name => {
		out[name] = true;
	});
	return out;
};

/**
* Conveyor order
* 1. Type
* 2. Compound
* 3. Post for current argument
* 4. Post for overal data
*/
let Validator = function (base = null, src = null, pre = null) {
    let self = this;
	
	self.base = base;
	self.pre  = pre;
	self.getBase = () => {
		return self.base;
	};

    const Validators = {
        int (v) {
            if (!/[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.fullName} must be int, but ${v.value} found`)];
            }
            v.value = parseInt(v.value);
            if (v._unsigned && v.value < 0) {
                return [checkMsg(v, `Parameter ${v.fullName} must be unsigned int, but ${v.value} found`)];
            }
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.fullName} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.fullName} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, v.value];
        },
        float (v) {
            if (!/[+-]*([0-9]*[.])?[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.fullName} must be float, but ${v.value} found`)];
            }
            v.value = parseFloat(v.value);
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.fullName} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.fullName} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, v.value];
        },
        string (v) {
            let val = v.value.toString();
            if (v._trim) {
                val = val.trim();
            }
            if (v._min && val.length < v._min) {
                return [checkMsg(v, `Parameter ${v.fullName} must be greater than ${v._min} chars long, but ${val.length} chars found`)];
            }
            if (v._max && val.length > v._max) {
                return [checkMsg(v, `Parameter ${v.fullName} must be less than ${v._max} chars long, but ${val.length} chars found`)];
            }
            return [null, val];
        },
        bool (v) {
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
            return [checkMsg(v, `Parameter ${v.fullName} must be boolean, hence true or false, but ${v.value} found`)];
        },
        func (v) {
            if (!v._operator) {
                return [checkMsg(v, `Parameter ${v.fullName} has functional validator, but no function found`)];
            }
            const res = v._operator(v.value);
            if (res) {
                return [null, v.value];
            }
            return [checkMsg(v, `Parameter ${v.fullName} doesn't match functional vaidator`)];
        },
        regexp (v) {
            if (!v._operator) {
                return [checkMsg(v, `Parameter ${v.fullName} has regexp validator, but no regular expression found`)];
            }
            let [err, str] = Validators.string(v);
            if (err) {
                return [err, null];
            }
            if (v._operator.test(str)) {
                return [null, str];
            }
            return [checkMsg(v, `Parameter ${v.fullName} doesn't match regexp validator ${v._operator.toString()}`)];
        },
		enum (v) {
			if (!v._operator) {
                return [checkMsg(v, `Parameter ${v.fullName} has enum validator, but no enumeration found`)];
            }
			let value = v.value.toString();
			if (v._operator.hasOwnProperty(value)) {
				return [null, value];
			}
			return [checkMsg(v, `Parameter ${v.fullName} is not part of ${JSON.stringify(Object.keys(v._operator))} enumeration`)];
		},
		array (v) {
			const isa = Array.isArray(v.value);
			if (v._strict && !isa) {
				return [checkMsg(v, `Parameter ${v.fullName} must be array`)];
			}
			let val;
			if (isa) {
				val = v.value;
			} else {
				try {
					val = JSON.parse(v.value);
				} catch (err) {
					return [checkMsg(v, `Parameter ${v.fullName} is not valid json array, found ${v.value}`)];
				}
			}
			if (v._exact && val.length != v._exact) {
				return [checkMsg(v, `Parameter ${v.fullName} must contain exactly ${v._exact} elements, but ${val.length} found`)];
			}
			if (v._min && val.length < v._min) {
				return [checkMsg(v, `Parameter ${v.fullName} must contain at least ${v._min} elements, but ${val.length} found`)];
			}
			if (v._max && val.length > v._max) {
				return [checkMsg(v, `Parameter ${v.fullName} must contain no more than ${v._max} elements, but ${val.length} found`)];
			}
			return [null, val];
		}
    };
    self.Validators = Validators;

    self.separator = globalOptions.separator;

    self.args = {};
    self._curSrc = src;
    self.errs    = [];
    self.options = {};

    self.setSeparator = (newSep) => {
        self.separator = newSep;
        return self;
    };

    self.setGlobal = (name, value) => {
        globalOptions[name] = value;
        return self;
    };

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
	
	Object.defineProperty(self, "end", {
		get: () => {
			return self.pre;
		}
	});

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
		if (v.type === 'object') {
			[err, result] = v._operator.build();
			if (err !== null && err !== undefined) {
				self.errs.push(err);
			}
			if (result !== null && err !== undefined) {
				self.options[v.name] = result;
			}
			return;
		}
        if (v._optional) {
            if (v.value === null || v.value === undefined) {
                if (v._default !== undefined && v._default !== null) {
                    v.value = v._default;
                    [err, result] = Validators[v.type](v);
                }
            } else {
				[err, result] = Validators[v.type](v);
			}
        } else {
            if (v.value === null || v.value === undefined) {
                err = `Parameter ${v.fullName} required, but nothing found`;
            } else {
                [err, result] = Validators[v.type](v);
            }
        }
        if (err !== null && err !== undefined) {
            self.errs.push(err);
        }
        if (result !== null && err !== undefined) {
            self.options[v.name] = result;
        }
    };

    Object.defineProperty(self, "compound", {
        get: () => {
            return new Compounder(self);
        }
    });
}

let Compounder = function (parent) {
    let self = this;

    self.parent = parent;
    self.build  = parent.build;

    const setError = (err) => {
        self.parent.errs.push(err);
    };

    const ifArgSet = (name) => {
        if (!self.parent.args.hasOwnProperty(name)) {
            throw new TypeError(`Compounder error: named argument ${name} was not found in arguments list`);
        }
    }

    self.any = (...names) => {
        for (let name of names) {
            ifArgSet(name);
            if (parent.args[name].wasSet) {
                return self;
            }
        }
        setError(checkMsg(self, `Any one of arguments ${names.join(', ')} must be defined`));
        return self;
    }

    self.atLeast = (count, ...names) => {
        if (count >= names.length) {
            throw new TypeError(`Compounder error: if atLeast(count, names...) compounder used, then count argument must be less than number of names`);
        }
        let counter = 0;
        for (name of names) {
            ifArgSet(name);
            if (parent.args[name].wasSet) {
                counter += 1;
            }
        }
        if (counter < count) {
            setError(checkMsg(self, `At least ${count} name in ${names.join(', ')} must be defined, but ${count} found`));
        }
        return self;
    }

    self.exact = (count, ...names) => {
        if (count >= names.length) {
            throw new TypeError(`Compounder error: if exact(count, names...) compounder used, then count argument must be less than number of names`);
        }
        let counter = 0;
        for (name of names) {
            ifArgSet(name);
            if (parent.args[name].wasSet) {
                counter += 1;
            }
        }
        if (counter !== count) {
            setError(checkMsg(self, `At least ${count} name in ${names.join(', ')} must be defined, but ${count} found`));
        }
        return self;
    }
	
	self.allOrNothing = (...names) => {
		let len = names.length,
			counter = 0;
		if (len === 1) {
			if (Array.isArray(names[0]) && names[0].length > 1) {
				names = names[0];
			} else {
				throw new TypeError(`Compounder error: allOrNothing compounder requires at least 2 arguments, but 1 found`);
			}
		}
		for (name of names) {
            ifArgSet(name);
            if (parent.args[name].wasSet) {
                counter += 1;
            }
        }
		if (counter !== len && counter !== 0) {
			setError(checkMsg(self, `All ${len} args, or no args must be set, but ${counter} set`));
		}
		return self;
	}

    self.message = (message) => {
        self._message = message;
        return self;
    }
}

let Variable = function (parent, name, value) {
    let self = this;

    self.parent  = parent;
    self.name    = name;
    self.value   = value;
    self.type    = null;
    self.message = null;
    self.wasSet  = false;
    if (value !== null && value !== undefined) {
        self.wasSet = true;
    }

    /*
    self._message = undefined;
    self._min = undefined;
    self._max = undefined;
    self._unsigned = undefined;
    self._trim = undefined;
    self._strict = undefined;
    self._default = undefined;
    self._operator = undefined;
	self._exact = undefined;
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
        if (typeof(typeName) === 'string' && self.parent.Validators.hasOwnProperty(typeName)) {
            self.type = typeName;
            return self;
        }
        if (typeof(typeName) === 'function') {
            self.type = "func";
            self._operator = typeName;
            return self;
        }
        throw new TypeError(`Variable.ofType error [005]. type name ${typeName} not defined. Use int, string, float, datetime. date, time, bool, regexp`);
    };

    self.regular = (re) => {
        self.type = "regexp";
        self._operator = re;
        return self;
    };

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
    Object.defineProperty(self, "compound", {
        get: () => {
            return self.parent.compound;
        }
    });
    ["trim", "unsigned", "strict", "ignorecase"].forEach(name => {
        Object.defineProperty(self, name, {
            get: () => {
                self[`_${name}`] = true;
                return self;
            }
        });
    });
    Object.keys(self.parent.Validators).forEach(key => {
        Object.defineProperty(self, key, {
            get: () => {
                self.ofType(key);
                return self;
            }
        });
    });
	Object.defineProperty(self, "object", {
		get: () => {
			self.type = "object";
			let base = self.parent.getBase();
			let nv = new Validator(base ? base + "." + self.name : self.name, self.value, self.parent);
			self._operator = nv;
			return nv;
		}
	});
    self.message = (value) => {
        self._message = value;
        return self;
    };
    self.operator = (value) => {
        self._operator = value;
        return self;
    };
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
	self.exactly = (num) => {
		if (num < 0) {
			throw new TypeError("Variable modifier exactly supports only unsigned values");
		}
		self._exact = num;
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
        self._operator = proc;
        return self;
    };
	self.enumeration = (...args) => {
		let data;
		if (args.length === 1) {
			if (Array.isArray(args[0])) {
				data = args[0];
			} else if (typeof(args[0]) === 'object') {
				data = Object.keys(args[0]);
			}
		} else {
			data = args;
		}
		self.type = "enum";
		self._operator = array2set(data);
		return self;
	};
    self.post = (proc) => {
        self._post = proc;
        return self;
    };
	Object.defineProperty(self, "end", {
		get: () => {
			return self.parent.end;
		}
	});
	Object.defineProperty(self, 'fullName', {
		get: () => {
			let path = self.parent.getBase();
			if (path) {
				return path + "." + self.name;
			}
			return self.name;
		}
	});
}

module.exports.Validator = Validator;




















