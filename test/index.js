const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiSubset = require('chai-subset')
const pkgJson = require('../package.json')
const expect = chai.expect

chai.use(chaiHttp)
chai.use(chaiSubset)

const server = app.listen()

describe('App', () => {
    after(() => {
        server.close()
    })

    context('Welcome', () => {
        it('responds with 200', (done) => {
            chai.request(server)
                .get('/')
                .set('Accept', 'application/json')
                .end((_, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })

        it('responds with JSON', (done) => {
            chai.request(server)
                .get('/')
                .set('Accept', 'application/json')
                .end((_, res) => {
                    expect(res).to.be.json
                    done()
                })
        })

        it('responds with current version', (done) => {
            chai.request(server)
                .get('/')
                .set('Accept', 'application/json')
                .end((_, res) => {
                    expect(res.body.version).to.equal(pkgJson.version)
                    done()
                })
        })
    })

    context('Services', () => {
        it('there are no services by default', (done) => {
            chai.request(server)
                .get('/services')
                .set('Accept', 'application/json')
                .end((_, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.empty
                    done()
                })
        })

        it('services can be created', (done) => {
            chai.request(server)
                .post('/services')
                .set('Content-Type', 'application/json')
                .send({
                    id: 'sample',
                    name: 'Sample',
                    description: 'Sample service',
                    instances: [
                        {
                            address: 'http://www.sample.com'
                        }
                    ]
                })
                .end((_, res) => {
                    expect(res).to.have.status(201)
                    done()
                })
        })

        it('duplicate services cannot be created', (done) => {
            chai.request(server)
                .post('/services')
                .set('Content-Type', 'application/json')
                .send({
                    id: 'sample',
                    name: 'Sample',
                    description: 'Sample service',
                    instances: [
                        {
                            address: 'http://www.sample.com'
                        }
                    ]
                })

            chai.request(server)
                .post('/services')
                .set('Content-Type', 'application/json')
                .send({
                    id: 'sample',
                    name: 'Sample',
                    description: 'Sample service',
                    instances: [
                        {
                            address: 'http://www.sample.com'
                        }
                    ]
                })
                .end((_, res) => {
                    expect(res).to.have.status(409)
                    done()
                })
        })

        context('a service is created', () => {
            beforeEach((done) => {
                chai.request(server)
                    .post('/services')
                    .set('Content-Type', 'application/json')
                    .send({
                        id: 'sample',
                        name: 'Sample',
                        description: 'Sample service',
                        instances: [
                            {
                                address: 'http://www.sample.com'
                            }
                        ]
                    })
                    .end(done)
            })

            it('appears on the list of services', (done) => {
                chai.request(server)
                    .get('/services')
                    .set('Accept', 'application/json')
                    .end((_, res) => {
                        expect(res).to.have.status(200)
                        expect(res.body).to.containSubset([
                            {
                                id: 'sample',
                                name: 'Sample',
                                description: 'Sample service',
                                instances: [
                                    {
                                        address: 'http://www.sample.com'
                                    }
                                ]
                            }
                        ])

                        expect(res.body[0].instances[0].since).to.be.a('number')

                        done()
                    })
            })

            it('instances can be added to a service', (done) => {
                chai.request(server)
                    .post('/services/sample/instances')
                    .set('Content-Type', 'application/json')
                    .send({
                        address: 'http://www1.sample.com'
                    })
                    .end((_, res) => {
                        expect(res).to.have.status(201)
                        done()
                    })
            })

            context('an instance is added to a service', () => {
                let startTime

                beforeEach((done) => {
                    chai.request(server)
                        .post('/services/sample/instances')
                        .set('Content-Type', 'application/json')
                        .send({
                            address: 'http://www1.sample.com'
                        })
                        .end(() => {
                            startTime = Date.now()

                            done()
                        })
                })

                it('appears on the list of instances', (done) => {
                    chai.request(server)
                        .get('/services/sample/instances')
                        .set('Accept', 'application/json')
                        .end((_, res) => {
                            expect(res).to.have.status(200)
                            expect(res.body).to.containSubset([
                                {
                                    address: 'http://www.sample.com'
                                }, 
                                {
                                    address: 'http://www1.sample.com'
                                }
                            ])

                            done()
                        })
                })

                it('the instance can be touched', (done) => {
                    chai.request(server)
                        .post('/services/sample/instances')
                        .set('Content-Type', 'application/json')
                        .send({
                            address: 'http://www1.sample.com'
                        })
                        .end((_, res) => {
                            expect(res).to.have.status(200)
                        })

                    chai.request(server)
                        .get('/services/sample/instances')
                        .set('Accept', 'application/json')
                        .end((_, res) => {
                            expect(res.body[1].since).to.be.greaterThan(startTime)
                            done()
                        })
                })
            })
        })
    })
})
