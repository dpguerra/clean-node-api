import { ValidationCompose, RequiredFieldsValidation, EmailFormatValidation } from '../../../presentation/helpers/validation'
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapater'

export const makeValidationCompose = (): ValidationCompose => {
  const emailValidatorAdapater = new EmailValidatorAdapter()
  return new ValidationCompose([
    new RequiredFieldsValidation(['email', 'password']),
    new EmailFormatValidation('email', emailValidatorAdapater)
  ])
}
