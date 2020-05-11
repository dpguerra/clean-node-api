import { LogInController } from './login-controller'
import { serverError, unauthorized, ok, badRequest } from '../../helpers'
import { InvalidUserOrPassword } from '../../../data/errors/invalid-user-or-email-error'
import { Authenticate, AuthenticateModel, HttpRequest } from './login-controller-protocols'
import { Validation } from '../../protocols/validation'
import { TokenModel } from '../../../domain/usecases/authenticate/authenticate-usecase'

const makeValidation = (): Validation<Error> => {
  class ValidationStub implements Validation<Error> {
    validate (input: Record<string, any>): null | Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (credentials: AuthenticateModel): Promise<TokenModel> {
      return await Promise.resolve({ token: 'valid_token' })
    }
  }
  return new AuthenticateStub()
}

interface SutTypes {
  sut: LogInController
  authenticateStub: Authenticate
  validationStub: Validation<Error>
}

const makeSut = (): SutTypes => {
  const authenticateStub = makeAuthenticate()
  const validationStub = makeValidation()
  return {
    sut: new LogInController(authenticateStub, validationStub),
    authenticateStub,
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
  test('should calls Validation with corrects values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('should returns 400 and an error if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('should returns 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
  test('should calls Autentication with corrects values', async () => {
    const { sut, authenticateStub } = makeSut()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body)
  })
  test('should returns 401 if invalid credetials are passed', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockImplementation(() => {
      throw new InvalidUserOrPassword()
    })
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized(new InvalidUserOrPassword()))
  })
  test('should returns 500 if Autentication throws', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockRejectedValue('error')
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
  test('should returns 200 and a token if valid credentials are passed', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ token: 'valid_token' }))
  })
})
