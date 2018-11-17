# secval
Parameter validator for Express framework

## Installation

`npm install secval --save`

## Usage

Create new instance of Validator and build typed parameter object
```
const { Validator } = require('secval');

app.post('/api/example', async (req, res) => {
    let [err, options] = new Validator()
        .with(req.body)
        .arg("email").required.string.between(3, 100)
        .arg("password").required.string.min(7)
        .build();
});
```

## with

`with(source: object)` defined source which would be used for args

```
let a = {
	email: "test@test.com",
	password: "1234567"
};

let [err, options] = new Validator()
	.with(a)
	.arg("email").required.string.between(3, 100)
	.arg("password").required.string.min(7)
	.build();
```

## arg

`arg(name: string)` defined new argument within source
```
let a = {
	target: 122113
};

let [err, options] = new Validator()
	.with(a)
	.arg("target").required.int
	.build();
```

`arg(name: string, param: any)` define variable for parameter

```
let a = 100;

let [err, options] = new Validator()
	.with(a)
	.arg("target", a).required.int
	.build();
```

## required

`required` set defined variable as required

## optional

`optional` set defined variable as optional

## default

`default(defValue: any)` set default value for defined **optional** variable. `defValue` still
will be validated

## ofType

`ofType(typeName: string)` set type to be validated. 

- int
- float
- string
- func
- bool
- regexp

Also, each type has similarly-named aliases (except regexp, which has name `regular`)
```
let a = 100;

let [err, options] = new Validator()
	.with(a)
	.arg("target", a).required.ofType('int')
	.build();
```

## min

`min(a: any)` generic modifier. Depends on type of the variable:

- int - min integer value
- float - min float value
- string/regexp - min length of string

## max

`max(a: any)` generic modifier. Depends on type of the variable:

- int - max integer value
- float - max float value
- string/regexp - max length of string

## between

`between(a: any, b: any)` generic modifier. Depends on type of the variable:

- int - min and max integer value
- float - min and max float value
- string/regexp - min and max length of string

## message

`message(msg: string)` set custom message if error occured

## build
`build` returns array [error, options]. First argument is error string,
options - object of typed variables.


















