const chai = require('chai')
const chaiHttp = require('chai-http')
const { app } = require('../build/index')

chai.use(chaiHttp);

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
      version: 0.0,
      seed: 0
    })
    expect(result).to.have.status(200);
  }).timeout(5000)

  it('should be able to fetch results', async () => {
    const connection = chai.request(app)
    let result = await connection.get('/api/results')
    expect(result).to.have.status(200);
  }).timeout(5000)

})