# secval
Route parameter validator.

Please, refer to https://github.com/ssypachev/secval to get latest version and docs.

## Installation

`npm install secval --save`

Or use git directly in `package.json`

`"secval": "git+https://github.com/ssypachev/secval.git"`

## Documentation

See wiki pages: https://github.com/ssypachev/secval/wiki

## SecVal - typed argument validator _primarily_ for Express JS Framework.

This library in beta, though is used in production projects. Main idea is to provide way to validate input arguments and return typed arguments, errors and warnings.

Example of usage:

```js
app.post('/users', async (req, res) => {
    let [err, options] = new Validator().with(req.body)
        .arg('username').required.string.between(3, 100)
        .arg('password').required.string.min(7)
        .arg('age').optional.unsigned.int.min(13)
        .arg('gender').optional.enumeration(['male', 'female'])
        .arg('location').optional.object
            .arg('latitude').optional.float
            .arg('longitude').optional.float
        .end
        .compounder.allOrNothing('latitude', 'longitude').build();
    if (err) {
        res.status(400).send({ error: err });
    }
    return new UserCtrl().create(req, res, options);
});
```

## Dependencies and testing

Library does not have any dependencies for production use. For testing `mocha` and `chai` is used. To test
call

`npm run test`
