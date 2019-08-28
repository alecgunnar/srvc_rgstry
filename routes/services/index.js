const router = require('express').Router()
const repository = require('./repository')

router.param('service', (req, res, next, id) => {
    const service = repository.getService(id)

    if (service === null)
        return res.sendStatus(404)

    req.service = service

    next()
})

router.get('/services/:service', (req, res) => {
    const {service} = req
    
    req.accepts('json') && !req.accepts('html')
        ? res.json(service)
        : res.render('service.mst', {...service})
})

router.get('/services/:service/instances', (req, res) => {
    const {service} = req
    
    req.accepts('json')
        ? res.json(service.instances)
        : res.sendStatus(400)
})

router.get('/services', (req, res) => {
    const services = repository.getServices()

    req.accepts('json') && !req.accepts('html')
        ? res.json(services)
        : res.render('services.mst', {services})
})

router.post('/services', (req, res) => {
    if (!req.is('application/json'))
        return res.sendStatus(415)

    let status = 201

    try {
        repository.saveService(req.body)
    } catch (err) {
        status = err.toHttpStatusCode()
    }

    res.sendStatus(status)
})

router.post('/services/:service/instances', (req, res) => {
    if (!req.is('application/json'))
        return res.sendStatus(415)

    const instanceExists = typeof req.service.instances.find(instance => instance.address === req.body.address) !== 'undefined'
    let status = instanceExists ? 200 : 201

    try {
        if (instanceExists)
            repository.touchInstance(req.service, req.body.address)
        else
            repository.saveInstance(req.service, req.body)
    } catch (err) {
        status = err.toHttpStatusCode()
    }

    res.sendStatus(status)
})

module.exports = router
