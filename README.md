## SecVal - typed argument validator _primarily_ for Express JS Framework.

This library in beta, though is used in production projects. Main idea is to provide way to validate 
input arguments and return typed arguments, errors and warnings.

Example of usage:

```js
app.post('/users', async (req, res) => {
    let [err, options] = new Validator().with(req.body)
        .arg('username').required.string.between(3, 100)
        .arg('password').required.string.min(7)
        .arg('age').optional.unsigned.int.min(13)
        .arg('currency').required.string.trim.exactly(3).toUpperCase
        .arg('gender').optional.enumeration(['male', 'female'])
        .arg('location').optional.object
            .arg('latitude').optional.float
            .arg('longitude').optional.float
            .compound.allOrNothing('latitude', 'longitude').build();
        .end        
    if (err) {
        res.status(400).send({ error: err });
    }
    return new UserCtrl().create(req, res, options);
});
```
Another one
```js
app.post('/api/v1/offices/:ouid/profiles', loginHelper.isLoggedInAndOfficeOwner, async (req, res) => {
    const [err, options] = new Validator()
        .with(req.params)
            .arg('ouid').required.string
        .with(req.body)
            .arg('name').required.string
            .arg('printerName').required.string
            .arg('customData').required.object.end
            .arg('price').required.float.min(0)
            .arg('settings').as('printerSettings').required.object
                .arg('isColor').required.bool
                .arg('allowDuplex').required.bool
                .arg('dpix').required.float
                .arg('dpiy').required.float
            .end
            .arg('paper').required.object
                .arg('name').required.string
                .arg('coating').optional.default('Undefined')
                    .enumeration(['Undefined', 'Gloss', 'Matte', 'Velvet', 'Linen', 'Silk'])
                .arg('width').required.unsigned.int
                .arg('height').required.unsigned.int
                .arg('printWidth').required.unsigned.int
                .arg('printHeight').required.unsigned.int
                .arg('marginTop').required.unsigned.int
                .arg('marginLeft').required.unsigned.int
        .build();
    if (err) {
        return res.sendErr(400, err);
    }
    return new ProfileCtrl().create(req, res, options);
});
```

## Installation

Install via npm

`npm install secval --save`

or directly from github

`"secval": "git+https://github.com/ssypachev/secval.git"`

## Documentation

https://github.com/ssypachev/secval/wiki

## Dependencies and testing

Library does not have any dependencies for production use. For testing `mocha` and `chai` is used. To test call

`npm run test`