import { forbiden, proceed } from '../helpers'
import { AccessDeniedError } from '../errors'
import { Middleware } from '../protocols/middleware'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/account/load-account-usecase'
import { AccountModel } from '../../domain/models/account'

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}
interface SutTypes {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  return {
    sut: new AuthMiddleware(loadAccountByTokenStub),
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
    await expect(response).rejects.toEqual(forbiden(new AccessDeniedError()))
  })
  test('should call LoadAccountByToken with correct value', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.headers['x-access-token'])
  })
  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(Promise.resolve(null))
    const response = sut.handle(makeFakeRequest())
    await expect(response).rejects.toEqual(forbiden(new AccessDeniedError()))
  })
  test('should return 100 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const response = sut.handle(makeFakeRequest())
    await expect(response).resolves.toEqual(proceed('any_id'))
  })
})
