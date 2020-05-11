import validator from 'validator'
import { EmailValidation } from '../../domain/usecases/validate/validation'

export class EmailValidatorAdapter implements EmailValidation {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
