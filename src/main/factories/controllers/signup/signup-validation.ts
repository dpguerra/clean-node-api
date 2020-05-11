import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailFormatValidation } from '../../../../data/usecases/validate'
import { EmailValidatorAdapter } from '../../../adapters/email-validator-adapater'

export const makeValidationCompose = (): ValidationCompose => {
  const emailValidatorAdapater = new EmailValidatorAdapter()
  return new ValidationCompose([
    new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
    new ComparedFieldsValidation('password', 'passwordConfirmation'),
    new EmailFormatValidation('email', emailValidatorAdapater)
  ])
}
