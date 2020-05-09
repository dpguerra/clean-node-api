import { SignUpController } from './signup-controller'
import { AccountModel, AddAccount, AddAccountModel, Authenticate, AuthenticateModel } from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { serverError, badRequest, ok } from '../../helpers'
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
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountStub()
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
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation<Error>
  authenticateStub: Authenticate
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticateStub = makeAuthenticate()

  return {
    sut: new SignUpController(addAccountStub, validationStub, authenticateStub),
    addAccountStub,
    validationStub,
    authenticateStub
  }
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@exemple.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@exemple.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

describe('SignUp Controller', () => {
  test('should call Validation with correct values', async () => {
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
  test('should return code 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(() => {
      throw new Error()
    })
    const request = makeFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('should call AddAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@exemple.com',
      password: 'valid_password'
    })
  })
  test('should return code 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await Promise.reject(new Error())
    })
    const request = makeFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('should calls Autentication with corrects values', async () => {
    const { sut, authenticateStub } = makeSut()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    const request = makeFakeRequest()
    const { email, password } = request.body
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({ email, password })
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
