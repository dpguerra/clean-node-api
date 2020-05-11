import { makeValidationCompose } from './signup-validation'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailFormatValidation } from '../../../../data/usecases/validate'
import { EmailValidation } from '../../../../domain/usecases/validate/validation'

jest.mock('../../../../data/usecases/validate/validation-compose')

const makeEmailValidator = (): EmailValidation => {
  class EmailValidatorStub implements EmailValidation {
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
      new EmailFormatValidation('email', makeEmailValidator())
    ])
  })
})
