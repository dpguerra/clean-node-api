import { LogInController } from './logIn'
import { serverError, unauthorized, ok } from '../../helpers'
import { InvalidUserOrPassword } from '../../errors'
import { Authentication, HttpRequest } from './logInProtocols'
import { Validation } from '../../protocols/validation'

const makeValidation = (): Validation<Error> => {
  class ValidationStub implements Validation<Error> {
    validate (input: Record<string, any>): null | Error {
      return null
    }
  }
  return new ValidationStub()
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
  authenticationStub: Authentication
  validationStub: Validation<Error>
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  return {
    sut: new LogInController(authenticationStub, validationStub),
    authenticationStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@exemple.com',
    password: 'valid_password'
  }
})

describe('LogIn Controller', () => {
  test('should call Validation with corrects values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
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
