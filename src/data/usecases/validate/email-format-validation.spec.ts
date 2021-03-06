import { EmailFormatValidation } from './email-format-validation'
import { InvalidParamError } from '../../../presentation/errors'
import { Validation, EmailValidation } from '../../../domain/usecases/validate/validation'

const fieldName = 'email'
const makeInput = (): {email: string} => ({
  email: 'valid_email@exemple.com'
})

interface SutTypes {
  sut: Validation<Error>
  emailValidatorStub: EmailValidation
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidation {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return {
    sut: new EmailFormatValidation(fieldName, emailValidatorStub),
    emailValidatorStub
  }
}
describe('Email Validation Helper', () => {
  test('should calls EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const input = makeInput()
    sut.validate(input)
    expect(isValidSpy).toBeCalledWith(input.email)
  })
  test('should returns an error if validation fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const input = makeInput()
    const result = sut.validate(input)
    expect(result).toEqual(new InvalidParamError(fieldName))
  })
  test('should returns null on validation success', () => {
    const { sut } = makeSut()
    const input = makeInput()
    const result = sut.validate(input)
    expect(result).toBeNull()
  })
  test('should throws if validator adapater throw', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
