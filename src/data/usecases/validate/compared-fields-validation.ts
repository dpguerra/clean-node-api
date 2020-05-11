import { Validation } from '../../../domain/usecases/validate/validation'
import { InvalidParamError } from '../../errors'

export class ComparedFieldsValidation implements Validation<InvalidParamError> {
  constructor (private readonly field: string, private readonly fieldToCompare: string) { }
  validate (input: Record<string, any>): null | InvalidParamError {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
    return null
  }
}
