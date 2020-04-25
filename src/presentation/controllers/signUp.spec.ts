import { SignUpController } from './signUp'
import { MissingParamError } from '../errors/missingParamError'
import { InvalidParamError } from '../errors/invalidParamError'
import { EmailValidator } from '../protocols/emailValidator'

interface SutTypes {
  sut: SignUpController
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
    sut: new SignUpController(emailValidatorStub),
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('should return code 400 and a error if no name is provided', () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'nome@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  test('should return code 400 and a error if no email is provided', () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  test('should return code 400 and a error if no password is provided', () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
  test('should return code 400 and a error if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        password: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('should return code 400 and a error if email provided is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'invalid_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
})
