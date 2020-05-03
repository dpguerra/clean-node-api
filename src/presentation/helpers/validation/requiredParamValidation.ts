import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'

export class RequiredParamValidation implements Validation<MissingParamError> {
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
