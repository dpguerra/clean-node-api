import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/emailValidator'

export class EmailValidation implements Validation < Error > {
  constructor (private readonly emailValidator: EmailValidator) { }
  validate (input: {email: string}): null | Error {
    if (this.emailValidator.isValid(input.email)) {
      return new Error('email')
    }
    return null
  }
}
