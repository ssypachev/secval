const ValidTypes = {
	"int": {
		description: "Integer"
	}
}

const BadTypeErrorTemplate = "Variable ${name} ";

const checkMsg = (v) => {
	if (v.message) {
		return v.message;
	}
	return `Variable`;
}

const Validators = {
	"_isint": (v) => {
		if (!/[0-9]+/.test(v.value.toString())) {
			return [checkMsg(v)];
		}
	}
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
	
	self.separator = ", ";

	//The set of objects to be validated
    self.args = {};
	//Current source. If defined, then arg1 will use _curSrc.
	self._curSrc = null;
	self.err = [];
	
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
			throw new TypeError(`Validator.arg error [004]. Method defined for 1 and 2 arguments, but ${argsLen} found`);
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
		if (self.err.length > 0) {
			let textErr = [];
			self.err.forEach((e) => {
				textErr.push(e);
			});
			return [textErr.join(self.separator), null];
		}
		return [null, null];
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
		if (v._optional) {
			if (v.value === null || v.value === undefined) {
				if (v._default) {
					self.setOption(v.name, v._default);
				}
			}
			const vName = "_is" + v.type;
			Validators[vName](v);
		}
	};
}

let Variable = function (parent, name, value) {
    let self = this;

    self.parent = parent;
    self.name   = name;
    self.value  = value;
	self.type   = null;
	
	self.arg = self.parent.arg;
	
	self.build = () => {
		return self.parent.build();
	}
	
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
	self.default = (value) => {
		self._default = value;
		return self;
	};
	self.between = (a, b) => {
		self._between = [a, b];
		return self;
	};
	self.min = (a) => {
		self._min = a;
		return self;
	};
	self.max = (b) => {
		self._max = a;
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




















