import { makeValidationCompose } from './login-validation'
import { ValidationCompose, RequiredFieldsValidation, EmailFormatValidation } from '../../../presentation/helpers/validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validation/validation-compose')

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
      new RequiredFieldsValidation(['email', 'password']),
      new EmailFormatValidation('email', makeEmailValidator())
    ])
  })
})
