import { Validation } from '../../protocols/validation'
// import { MissingParamError } from '../../errors'

export class MissingParamValidation implements Validation<Error> {
  constructor (private readonly requiredFields: string[]) { }
  validate (input: Record<string, any>): null | Error {
    for (const field of this.requiredFields) {
      if (!input[field]) {
        return new Error(field)
      }
    }
    return null
  }
}
