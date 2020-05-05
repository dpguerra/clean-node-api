import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

export class EmailFormatValidation implements Validation <InvalidParamError> {
  constructor (private readonly field: string, private readonly emailValidator: EmailValidator) { }
  validate (input: Record<string, any>): null | InvalidParamError {
    if (!this.emailValidator.isValid(input[this.field])) {
      return new InvalidParamError(this.field)
    }
    return null
  }
}
