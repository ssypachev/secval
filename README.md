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
