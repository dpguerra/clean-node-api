import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/emailValidator'
import { InvalidParamError } from '../../errors'

export class EmailValidation implements Validation <InvalidParamError> {
  constructor (private readonly field: string, private readonly emailValidator: EmailValidator) { }
  validate (input: Record<string, any>): null | InvalidParamError {
    if (!this.emailValidator.isValid(input[this.field])) {
      return new InvalidParamError(this.field)
    }
    return null
  }
}
