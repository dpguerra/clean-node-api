import { DBAuthenticate } from './dbAuthenticate'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hashComparer'

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

const makeHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    compare (password: string, hashedPassword: string): boolean {
      return true
    }
  }
  return new HashCompareStub()
}

interface SutTypes {
  sut: Authentication
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
  hashCompareStub: HashComparer
}
const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const hashCompareStub = makeHashCompare()
  return {
    sut: new DBAuthenticate(loadAccountByIdRepositoryStub, hashCompareStub),
    loadAccountByIdRepositoryStub,
    hashCompareStub
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
  test('should call HashCompare with corrects values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const loadSpy = jest.spyOn(hashCompareStub, 'compare')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    await sut.auth(credential)
    expect(loadSpy).toBeCalledWith(credential.password, account.password)
  })
})
