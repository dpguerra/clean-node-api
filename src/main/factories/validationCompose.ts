import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailFormatValidation } from '../../presentation/helpers/validation'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapater'

export const makeValidationCompose = (): ValidationCompose => {
  const emailValidatorAdapater = new EmailValidatorAdapter()
  return new ValidationCompose([
    new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
    new ComparedFieldsValidation('password', 'passwordConfirmation'),
    new EmailFormatValidation('email', emailValidatorAdapater)
  ])
}
