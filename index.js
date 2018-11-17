const checkMsg = (v, stdMsg) => {
    if (v._message) {
        return v._message;
    }
    return stdMsg;
}

let globalOptions = {
    separator: ", "
};

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
        int (v) {
            if (!/[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.name} must be int, but ${v.value} found`)];
            }
            v.value = parseInt(v.value);
            if (v._unsigned && v.value < 0) {
                return [checkMsg(v, `Parameter ${v.name} must be unsigned int, but ${v.value} found`)];
            }
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.name} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.name} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, v.value];
        },
        float (v) {
            if (!/[+-]*([0-9]*[.])?[0-9]+/.test(v.value.toString())) {
                return [checkMsg(v, `Parameter ${v.name} must be float, but ${v.value} found`)];
            }
            v.value = parseFloat(v.value);
            if (v._min && v.value < v._min) {
                return [checkMsg(v, `Parameter ${v.name} must be greater than ${v._min}, but ${v.value} found`)];
            }
            if (v._max && v.value > v._max) {
                return [checkMsg(v, `Parameter ${v.name} must be less than ${v._max}, but ${v.value} found`)];
            }
            return [null, v.value];
        },
        string (v) {
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
            return [checkMsg(v, `Parameter ${v.name} must be boolean, hence true or false, but ${v.value} found`)];
        },
        func (v) {
            if (!v._operator) {
                return [checkMsg(v, `Parameter ${v.name} has functional validator, but no function found`)];
            }
            const res = v._operator(v.value);
            if (res) {
                return [null, v.value];
            }
            return [checkMsg(v, `Parameter ${v.name} doesn't match functional vaidator`)];
        },
        regexp (v) {
            if (!v._operator) {
                return [checkMsg(v, `Parameter ${v.name} has regexp validator, but no regular expression found`)];
            }
            let [err, str] = Validators.string(v);
            if (err) {
                return [err, null];
            }
            if (v._operator.test(str)) {
                return [null, str];
            }
            return [checkMsg(v, `Parameter ${v.name} doesn't match regexp validator ${v._operator.toString()}`)];
        }
    };
    self.Validators = Validators;

    self.separator = globalOptions.separator;

    self.args = {};
    self._curSrc = null;
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
                if (v._default !== undefined && v._default !== null) {
                    v.value = v._default;
                    [err, result] = Validators[v.type](v);
                }
            }
        } else {
            if (v.value === null || v.value === undefined) {
                err = `Parameter ${v.name} required, but nothing found`;
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
    ["trim", "unsigned", "strict"].forEach(name => {
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
    self.post = (proc) => {
        self._post = proc;
        return self;
    };
}

module.exports.Validator = Validator;




















