import { LogInController } from './logIn'
import { badRequest, serverError, unauthorized, ok } from '../../helpers'
import { MissingParamError, InvalidUserOrPassword } from '../../errors'
import { Authentication, EmailValidator, HttpRequest } from './logInProtocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (user: string, pass: string): Promise<string> {
      return await Promise.resolve('valid_token')
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LogInController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  return {
    sut: new LogInController(emailValidatorStub, authenticationStub),
    emailValidatorStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@exemple.com',
    password: 'valid_password'
  }
})

describe('LogIn Controller', () => {
  test('should returns 400 and an error if no email is passed', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        password: 'valid_password'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should returns 400 and an error if no password is passed', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'valid_email@exemple.com'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should call EmailValidator with corrects values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@exemple.com')
  })
  test('should returns 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
  test('should call Autentication with corrects values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('valid_email@exemple.com', 'valid_password')
  })
  test('should returns 401 if invalid credetials are passed', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValue('unauthorized')
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized(new InvalidUserOrPassword()))
  })
  test('should returns 500 if Autentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValue('error')
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
  test('should returns 200 and a token if valid credentials are passed', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok('valid_token'))
  })
})
