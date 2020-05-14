import { ValidationCompose, RequiredFieldsValidation } from '../../../../data/usecases/validate'

export const makeValidationCompose = (): ValidationCompose => {
  return new ValidationCompose([
    new RequiredFieldsValidation(['question', 'answers'])
  ])
}
