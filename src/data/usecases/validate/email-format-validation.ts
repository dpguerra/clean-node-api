import { Validation, EmailValidation } from '../../../domain/usecases/validate/validation'
import { InvalidParamError } from '../../../presentation/errors'

export class EmailFormatValidation implements Validation <InvalidParamError> {
  constructor (private readonly field: string, private readonly emailValidator: EmailValidation) { }
  validate (input: Record<string, any>): null | InvalidParamError {
    if (!this.emailValidator.isValid(input[this.field])) {
      return new InvalidParamError(this.field)
    }
    return null
  }
}
