const router = require('express').Router();
const pkgJson = require('../package.json')

router.use(require('./services'))

const details = {
    name: 'srvc_rgstry',
    version: pkgJson.version
}

router.get('/', (req, res) => {
    req.accepts('json') && !req.accepts('html')
        ? res.json(details)
        : res.render('welcome.mst', details)
})

module.exports = router
