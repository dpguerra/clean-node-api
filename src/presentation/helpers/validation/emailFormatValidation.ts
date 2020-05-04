import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/emailValidator'
import { InvalidParamError } from '../../errors'

export class EmailValidation implements Validation <InvalidParamError> {
  constructor (private readonly emailValidator: EmailValidator) { }
  validate (input: { email: string }): null | InvalidParamError {
    if (!this.emailValidator.isValid(input.email)) {
      return new InvalidParamError('email')
    }
    return null
  }
}
