import { makeValidationCompose } from './validationCompose'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailValidation } from '../../presentation/helpers/validation'
import { EmailValidator } from '../../presentation/protocols/emailValidator'

jest.mock('../../presentation/helpers/validation/validationCompose')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Validation Compose Factory', () => {
  test('should calls ValidationCompose helper with corrects values', () => {
    makeValidationCompose()
    expect(ValidationCompose).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new ComparedFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
