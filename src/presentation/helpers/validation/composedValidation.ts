import { Validation } from '../../protocols/validation'

export class ComposedValidation implements Validation<Error> {
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
