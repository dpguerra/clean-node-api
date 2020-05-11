import { makeValidationCompose } from './login-validation'
import { EmailValidation } from '../../../../domain/usecases/validate/validation'
import { RequiredFieldsValidation, EmailFormatValidation, ValidationCompose } from '../../../../data/usecases/validate'

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
      new RequiredFieldsValidation(['email', 'password']),
      new EmailFormatValidation('email', makeEmailValidator())
    ])
  })
})
