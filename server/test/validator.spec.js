const { expect } = require('chai')
const { getValidator } = require('../build/database')

describe('Validator Tests', () => {

  it('should not validate incorrect data', async () => {
    var validator = getValidator()
    const result = validator({
      test: 'hello'
    })
    expect(result.valid).to.be.false
  })

  it('should validate correct data', async () => {
    var validator = getValidator()
    const result = validator({
      tiles: [],
      avatar: 'avatar',
      playgroundType: 'type',
      missing: 'lorem',
      version: 0.0,
      seed: 0
    })
    expect(result.valid).to.be.true
  })

})