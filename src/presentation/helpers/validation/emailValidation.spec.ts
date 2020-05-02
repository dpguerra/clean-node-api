import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/emailValidator'
import { EmailValidation } from './emailValidation'

const makeInput = (): {email: string} => ({
  email: 'valid_email@exemple.com'
})

interface SutTypes {
  sut: Validation<Error>
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return {
    sut: new EmailValidation(emailValidatorStub),
    emailValidatorStub
  }
}
describe('Email Validation Helper', () => {
  test('should call EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const input = makeInput()
    sut.validate(input)
    expect(isValidSpy).toBeCalledWith(input.email)
  })
})
