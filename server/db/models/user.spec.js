const {expect} = require('chai')
const db = require('../index')
const User = db.model('user')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let someone

      beforeEach(async () => {
        someone = await User.create({
          email: 'default@email.com',
          password: 'abc123'
        })
      })

      it('returns true if the password is correct', () => {
        expect(someone.correctPassword('abc123')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(someone.correctPassword('abcd12')).to.be.equal(false)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')
}) // end describe('User model')
