import { SignUpController } from './signUp'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
const makeEmailValidator = (should: boolean): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return should
    }
  }
  return new EmailValidatorStub()
}
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator(true)
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
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'any_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })
  test('should return code 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError()
    const sut = new SignUpController(emailValidatorStub)
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'any_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    sut.handle(request)
    const response = sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
})
