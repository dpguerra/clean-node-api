import { ConfirmationParamsValidation } from './confirmationParamsValidation'

describe('Confirmation Params Validation Helper', () => {
  test('should return an error if provided field are different', () => {
    const sut = new ConfirmationParamsValidation('password', 'passwordConfirmation')
    const result = sut.validate({
      password: 'correct_password',
      passwordConfirmation: 'wrong_password'
    })
    expect(result).toEqual(new Error('passwordConfirmation'))
  })
})
