const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../build/index')
const _ = require('lodash')

chai.use(chaiHttp)

const expect = chai.expect;

describe('API Routes', () => {

  it('should connect to app', async () => {
    await chai.request(app)
  })

  it('should be able to post a result', async () => {
    const connection = chai.request(app)
    let result = await connection.post('/api/results').send({
      tiles: [],
      avatar: 'avatar',
      playgroundType: 'type',
      missing: 'lorem',
      version: '0.0',
      seed: 0
    })
    expect(result).to.have.status(200);
  }).timeout(5000)

  it('should not be able to post ill-formated result', async () => {
    const connection = chai.request(app)
    let result = await connection.post('/api/results').send({
      tiles: [],
      avatar: 'avatar',
      playgroundType: 'type',
      missing: 'lorem',
      version: '0.0',
      seed: 0,
      what: "?"
    })
    expect(result).to.have.status(400);
  }).timeout(5000)

  it('should be able to fetch results', async () => {
    const connection = chai.request(app)
    let result = await connection.get('/api/results')
    expect(result).to.have.status(200);
  }).timeout(5000)

  it('should be able to fetch result which was just posted', async () => {
    const connection = chai.request(app)
    const seed = Math.floor(Math.random() * 1000)
    await connection.post('/api/results').send({
      tiles: [],
      avatar: 'avatar',
      playgroundType: 'type',
      missing: 'lorem',
      version: '0.0',
      seed: seed
    })
    let result = await chai.request(app).get('/api/results')
    expect(_.last(result.body).data.seed).to.equal(seed)
  }).timeout(5000)

  it('results should have a date field', async () => {
    const connection = chai.request(app)
    let result = await connection.get('/api/results')
    expect(_.last(result.body).date).to.not.be.undefined
  }).timeout(5000)

})