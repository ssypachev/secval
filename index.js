const moment = require('moment');
const EmailValidator = require('email-validator');

const checkMsg = (v, stdMsg) => {
    if (v._message) {
        return v._message;
    }
    return stdMsg;
}

let globalOptions = {
    separator: ", "
};

let isDef = (o) => {
	return o !== undefined && o !== null;
}

const array2set = (arr) => {
	let out = {};
	arr.forEach(name => {
		out[name] = true;
	});
	return out;
};

const PostProcessors = {
	array (v, val) {
		if (v._sort) {
			if (typeof(v._sort) === 'boolean') {
				val.sort();
			} else {
				val.sort(v._sort);
			}
		}
		return val;
	},
	string (v, val) {
		if (v._toUpperCase) {
			val = val.toUpperCase();
		}
		if (v._toLowerCase) {
			val = val.toLowerCase();
		}
		return val;
	},
	regexp (v, val) {
		return this.string(v, val);
	},
	uuid (v, val) {
		return this.string(v, val);
	},
	email (v, val) {
		return this.string(v, val);
	}
};

const Validators = {
	int (v) {
		if (v._strict && typeof(v.value) !== 'number') {
			return [checkMsg(v, `Parameter ${v.fullName}, in strict mode, must be number, but ${v.value} found`)];
		}
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
		if (v._strict && typeof(v.value) !== 'number') {
			return [checkMsg(v, `Parameter ${v.fullName}, in strict mode, must be number, but ${v.value} found`)];
		}
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
		if (v._strict && typeof(v.value) !== 'string') {
			return [checkMsg(v, `Parameter ${v.fullName} must be of type string`)];
		}
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
		if (v._exact && val.length !== v._exact) {
			return [checkMsg(v, `Parameter ${v.fullName} must be of length ${v._exact}, but ${val.length} chars found`)];
		}
		if (v._uppercase && val !== val.toUpperCase()) {
			return [checkMsg(v, `Parameter ${v.fullName} must be uppercase`)];
		}
		if (v._lowercase && val !== val.toLowerCase()) {
			return [checkMsg(v, `Parameter ${v.fullName} must be lowercase`)];
		}
		return [null, val];
	},
	bool (v) {
		let t = typeof(v.value);
		if (v._strict && t !== 'boolean') {
			return [checkMsg(v, `Parameter ${v.fullName} must be boolean, hence true or false, but ${v.value} found`)];
		}
		switch (t) {
		case "boolean":
			return [null, v.value];
			break;
		case "string":
			let flags = v._ignorecase ? "i" : "";
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
	any (v) {
		return [null, v.value];
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
	},
	uuid (v) {
		let [err, str] = Validators.string(v);
		if (err) {
			return [err, null];
		}
		let version, errcode;
		if (v._v1) {
			version = 1;
		} else if (v._v3) {
			version = 3;
		} else if (v._v4) {
			version = 4;
		} else if (v._v5) {
			version = 5;
		} else {
			version = '[0-9a-f]';
		}
		let reg = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-' + version + '[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', "i");
		if (reg.test(str)) {
			return [null, str];
		}
		return [checkMsg(v, `Parameter ${v.fullName} is not valid UUID ${typeof(version) === 'number' ? 'V' + version + " " : ""}string`)];
	},
	datetime (v) {
		const [fmt, strict] = v._operator ? [v._operator, true] : [undefined, false];
		if (!moment(v.value, fmt, strict).isValid()) {
			return [checkMsg(v, `Parameter ${v.fullName} is not valid datetime`)];
		}
		
		const m = moment(v.value, fmt, strict);
		if (v._min) {
			const tmin = moment(v._min, fmt, strict);
			if (m.isBefore(tmin)) {
				return [checkMsg(v, `Parameter ${v.fullName} must be after ${tmin.toString()}, but ${m.toString()} found`)];
			}
		}
		if (v._max) {
			const tmax = moment(v._max, fmt, strict);
			if (m.isAfter(tmax)) {
				return [checkMsg(v, `Parameter ${v.fullName} must be before ${tmax.toString()}, but ${m.toString()} found`)];
			}
		}
		if (v._js) {
			return [null, m.toDate()];
		}
		return [null, m];
	},
	email (v) {
		let [err, str] = Validators.string(v);
		if (err) {
			return [err, null];
		}
		if (EmailValidator.validate(str)) {
			return [null, str];
		}
		return [checkMsg(v, `Parameter ${v.fullName} must be valid email`)];
	}
};

let Validator = function ({ base = null, src = null, pre = null, omit = false, gmap = null } = {}) {
    let self = this;
	
	self.base = base;
	self.pre  = pre;
	self.omit = omit;
	if (gmap === null) {
		self.gmap = {};
	} else {
		self.gmap = gmap;
	}
	
	self.getBase = () => {
		return self.base;
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
	
	self.internalBuild = () => {
		if (self.omit === true) {
			return [null, null];
		}
        self.validateAll();
        if (self.errs.length > 0) {
            let textErr = [];
            self.errs.forEach((e) => {
                textErr.push(e);
            });
            return [textErr.join(self.separator), null];
        }
        return [null, self.options];
	}

    self.build = () => {
		tmp = self.pre;
		if (tmp) {
			while (tmp.pre !== null) {
				tmp = tmp.pre;
			}
			return tmp.build();
		}
		return self.internalBuild();
    };

    self.arguments = () => {
        return self.arguments;
    };

    self.validateAll = () => {
        Object.values(self.args).forEach((item) => {
            self.validate(item);
        });
    };
	
	self.setOption = function (v, result) {
		self.options[v._as ? v._as : v.name] = result;
	};

    self.validate = (v) => {
        if (v.type === null) {
            throw new TypeError("Can not validate untyped argument");
        }
        let err, result;
		if (v.type === 'object') {
			[err, result] = v._operator.internalBuild();
			if (isDef(err)) {
				self.errs.push(err);
			}
			if (result !== null && err !== undefined) {
				self.setOption(v, result);
			}
			return;
		}
		
        if (v._optional) {
            if (v.value === null || v.value === undefined) {
                if (isDef(v._default)) {
                    v.value = v._default;
                    [err, result] = v.validate();
                }
            } else {
				[err, result] = v.validate();
			}
        } else {
            if (!isDef(v.value)) {
                err = `Parameter ${v.fullName} required, but nothing found`;
            } else {
                [err, result] = v.validate();
            }
        }
        if (isDef(err)) {
            self.errs.push(err);
        }
        if (result !== null && err !== undefined) {
			if (PostProcessors.hasOwnProperty(v.type) && isDef(result)) {
				result = PostProcessors[v.type](v, result);
			}
            self.setOption(v, result);
        }
    };

    Object.defineProperty(self, "compound", {
        get: () => {
            return new Compounder(self);
        }
    });
}

let ValidatorItem = function (parent) {
	this.parent = parent;
	this.build  = parent.build;
	this.arg    = parent.arg;
	this.with   = parent.with;
}

let Compounder = function (parent) {
	ValidatorItem.call(this, parent);
    let self = this;

    const setError = (err) => {
        self.parent.errs.push(err);
    };

    const ifArgSet = (name) => {
        if (!self.parent.gmap.hasOwnProperty(name)) {
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
            if (parent.gmap[name].wasSet) {
                counter += 1;
            }
        }
		if (counter !== len && counter !== 0) {
			setError(checkMsg(self, `All ${len} args, or no args must be set, but ${counter} set`));
		}
		return self;
	}
	
	self.func = (names, fun) => {
		if (!Array.isArray(names)) {
			throw new TypeError(`Compounder error: func compounder requires first argument to be array`);
		}
		if (typeof(fun) !== 'function') {
			throw new TypeError(`Compounder error: func compounder requires second argument to be function`);
		}
		let fa = [];
		for (let name of names) {
			fa.push(parent.gmap[name].value);
		}
		if (!fun.apply(self, fa)) {
			setError(checkMsg(self, `${fa} arguments do[es] not satisfy functional compounder`));
		}
		return self;
	}

    self.message = (message) => {
        self._message = message;
        return self;
    }
}
Compounder.prototype = ValidatorItem.prototype;

let Variable = function (parent, name, value) {
	ValidatorItem.call(this, parent);
    let self = this;

    self.name    = name;
    self.value   = value;
    self.type    = 'any';
    self.message = null;
    self.wasSet  = false;
	self.iterable = false;
	
	self.xfullName = () => {
		const path = self.parent.getBase();
		const tmp = self._as ? self._as : self.name;
		if (path) {
			return path + "." + tmp;
		}
		return tmp;
	};
	
	self.parent.gmap[self.xfullName()] = self;
    if (isDef(value)) {
        self.wasSet = true;
    }

    /*
    self._message = undefined;
    self._min = undefined;
    self._max = undefined;
    self._unsigned = undefined;
    self._ignorecase = undefined;
    self._trim = undefined;
    self._strict = undefined;
    self._default = undefined;
    self._operator = undefined;
	self._exact = undefined;
    */
	
	self.validate = () => {
		return Validators[self.type](self);
	}

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
        throw new TypeError(`Variable.ofType error. type name ${typeName} not defined. Use int, string, float, datetime. date, time, bool, regexp`);
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
    
    Object.keys(self.parent.Validators).forEach(key => {
        Object.defineProperty(self, key, {
            get: () => {
                self.ofType(key);
                return self;
            }
        });
    });
	["operator", "default", "message"].forEach(name => {
		self[name] = (value) => {
			self[`_${name}`] = value;
			return self;
		}
	});
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
	self.format = (fmt) => {
		self._operator = fmt;
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
	
	self.sort = (func) => {
		if (typeof(func) !== 'function') {
			self._sort = true;
		} else {
			self._sort = func;
		}
		return self;
	};
	
	Object.defineProperty(self, "compound", {
        get: () => {
            return self.parent.compound;
        }
    });
    [
		"trim", 
		"unsigned", 
		"strict", 
		"ignorecase", 
		"toLowerCase", 
		"toUpperCase", 
		"uppercase", 
		"lowercase",
		"v1",
		"v3",
		"v4",
		"v5",
		"js"
	].forEach(name => {
        Object.defineProperty(self, name, {
            get: () => {
                self[`_${name}`] = true;
                return self;
            }
        });
    });
	Object.defineProperty(self, "object", {
		get: () => {
			self.type = "object";
			let base = self.parent.getBase(),
				newSrc, 
				newOmit = false;
			if (self._optional) {
				if (isDef(self._default)) {
					self.value = self._default;
				} else if (!isDef(self.value)) {					
					newOmit = true;
				}
			}
			if (typeof(self.value) === "object" && self.value !== null) {
				newSrc = self.value;
			} else {
				if (newOmit === false) {
					parent.errs.push(checkMsg(self, `Parameter ${self.fullName} must be object`));
				}
				newSrc = {};
			}
			if (self.omit === true) {
				newOmit = true;
			}
			const tmp = self._as ? self._as : self.name;
			let nv = new Validator({
				base: (base ? base + "." + tmp : tmp), 
				src:  newSrc, 
				pre:  self.parent, 
				omit: newOmit, 
				gmap: self.parent.gmap
			});
			self._operator = nv;
			return nv;
		}
	});
	Object.defineProperty(self, "end", {
		get: () => {
			return self.parent.end;
		}
	});
	Object.defineProperty(self, 'fullName', {
		get: () => {
			const path = self.parent.getBase();
			const tmp = self._as ? self.as : self.name;
			if (path) {
				return path + "." + tmp;
			}
			return tmp;
		}
	});
	
	self.as = function (name) {
		self._as = name;
		console.log(self.xfullName());
		self.parent.gmap[self.xfullName()] = self;
		return self;
	}
}
Variable.prototype = ValidatorItem.prototype;

module.exports.Validator = Validator;




















