import { ComparedFieldsValidation } from './compared-fields-validation'
import { InvalidParamError } from '../../errors'

describe('Confirmation Params Validation Helper', () => {
  test('should returns an error if provided field are different', () => {
    const sut = new ComparedFieldsValidation('password', 'passwordConfirmation')
    const result = sut.validate({
      password: 'correct_password',
      passwordConfirmation: 'wrong_password'
    })
    expect(result).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('should returns null if provided field match', () => {
    const sut = new ComparedFieldsValidation('password', 'passwordConfirmation')
    const result = sut.validate({
      password: 'correct_password',
      passwordConfirmation: 'correct_password'
    })
    expect(result).toBeNull()
  })
})
