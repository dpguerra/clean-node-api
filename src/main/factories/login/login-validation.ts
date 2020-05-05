import { ValidationCompose, RequiredFieldsValidation, EmailFormatValidation } from '../../../presentation/helpers/validation'
import { EmailValidatorAdapter } from '../../adapters/email-validator-adapater'

export const makeValidationCompose = (): ValidationCompose => {
  const emailValidatorAdapater = new EmailValidatorAdapter()
  return new ValidationCompose([
    new RequiredFieldsValidation(['email', 'password']),
    new EmailFormatValidation('email', emailValidatorAdapater)
  ])
}
