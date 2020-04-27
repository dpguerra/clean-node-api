import { EmailValidatorAdapter } from './emailValidatorAdapater'

describe('EmailValidator Adapater', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@exemple.com')
    expect(isValid).toBe(false)
  })
})
