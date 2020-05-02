import { Validation } from '../../protocols/validation'

export class ConfirmationParamsValidation implements Validation<Error> {
  constructor (private readonly field: string, private readonly fieldToCompare: string) { }
  validate (input: Record<string, any>): null | Error {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new Error(this.fieldToCompare)
    }
    return null
  }
}
