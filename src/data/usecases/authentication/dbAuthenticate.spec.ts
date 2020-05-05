import { DBAuthenticate } from './dbAuthenticate'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_hashed_password'
})
const makeFakeCredential = (): AuthenticationModel => ({
  email: 'any_email',
  password: 'any_password'
})

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async load (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

interface SutTypes {
  sut: Authentication
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  return {
    sut: new DBAuthenticate(loadAccountByIdRepositoryStub),
    loadAccountByIdRepositoryStub
  }
}

describe('DBAuthenticate Usecase', () => {
  test('should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'load')
    const credential = makeFakeCredential()
    await sut.auth(credential)
    expect(loadSpy).toBeCalledWith(credential.email)
  })
  test('should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
})
