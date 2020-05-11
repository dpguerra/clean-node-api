import { Validation } from '../../../domain/usecases/validate/validation'

export class ValidationCompose implements Validation<Error> {
  constructor (private readonly validations: Array<Validation<Error>>) { }
  validate (input: Record<string, any>): null | Error {
    for (const validation of this.validations) {
      const result = validation.validate(input)
      if (result) {
        return result
      }
    }
    return null
  }
}
