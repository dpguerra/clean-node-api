import { makeValidationCompose } from './validationCompose'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailValidation } from '../../presentation/helpers/validation'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapater'

jest.mock('../../presentation/helpers/validation/validationCompose')

describe('Validation Compose Factory', () => {
  test('should calls ValidationCompose helper with corrects values', () => {
    makeValidationCompose()
    const emailValidatorAdapater = new EmailValidatorAdapter()
    expect(ValidationCompose).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new ComparedFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', emailValidatorAdapater)
    ])
  })
})
