import { forbiden, proceed, serverError } from '../helpers'
import { AccessDeniedError } from '../errors'
import { HttpRequest, Middleware } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken, LoadAccountByTokenModel } from '../../domain/usecases/account/load-account-usecase'
import { AccountModel } from '../../domain/models/account'

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (query: LoadAccountByTokenModel): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}
interface SutTypes {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  return {
    sut: new AuthMiddleware(loadAccountByTokenStub, role),
    loadAccountByTokenStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})
const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

describe('Authentication Middleware tests', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = sut.handle({})
    await expect(response).resolves.toEqual(forbiden(new AccessDeniedError()))
  })
  test('should call LoadAccountByToken with corrects values', async () => {
    const request = makeFakeRequest()
    const query = {
      token: request.headers['x-access-token'],
      role: 'any_role'
    }
    const { sut, loadAccountByTokenStub } = makeSut(query.role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(query)
  })
  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(Promise.resolve(null))
    const response = sut.handle(makeFakeRequest())
    await expect(response).resolves.toEqual(forbiden(new AccessDeniedError()))
  })
  test('should return 100 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const response = sut.handle(makeFakeRequest())
    await expect(response).resolves.toEqual(proceed({ id: 'any_id' }))
  })
  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })
    const response = sut.handle(makeFakeRequest())
    await expect(response).resolves.toEqual(serverError(new Error()))
  })
})
