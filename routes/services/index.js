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

    res.sendStatus(
        repository.saveService(req.body)
    )
})

router.post('/services/:service/instances', (req, res) => {
    if (!req.is('application/json'))
        return res.sendStatus(415)

        res.sendStatus(
            repository.saveInstance(req.service, req.body)
        )
})

module.exports = router
