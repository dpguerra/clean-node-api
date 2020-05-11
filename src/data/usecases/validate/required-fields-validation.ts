import { Validation } from '../../../domain/usecases/validate/validation'
import { MissingParamError } from '../../../presentation/errors'

export class RequiredFieldsValidation implements Validation<MissingParamError> {
  constructor (private readonly requiredFields: string[]) { }
  validate (input: Record<string, any>): null | MissingParamError {
    for (const field of this.requiredFields) {
      if (!input[field]) {
        return new MissingParamError(field)
      }
    }
    return null
  }
}
