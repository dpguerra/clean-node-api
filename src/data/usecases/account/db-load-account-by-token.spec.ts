import { LoadAccountByToken, LoadAccountByTokenModel, LoadAccountByIdModel } from '../../../domain/usecases/account/load-account-usecase'
import { LoadAccountByIdRepository } from '../../protocols/db/load-account-by-id-repository'
import { AccountModel } from '../../../domain/models/account'
import { DBLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'

const makeDecrypter = (): Decrypter => {
  class Descrypter implements Decrypter {
    async decrypt (token: Object): Promise<any> {
      return await Promise.resolve({ id: 'any_id' })
    }
  }
  return new Descrypter()
}
const makeAccountMongoRepository = (): LoadAccountByIdRepository => {
  class AccountMongoRepositoryStub implements LoadAccountByIdRepository {
    async loadById (query: LoadAccountByIdModel): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AccountMongoRepositoryStub()
}

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  accountMongoRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const accountMongoRepositoryStub = makeAccountMongoRepository()
  return {
    sut: new DBLoadAccountByToken(decrypterStub, accountMongoRepositoryStub),
    decrypterStub,
    accountMongoRepositoryStub
  }
}
const makeFakeQueryToken = (): LoadAccountByTokenModel => ({
  token: 'any_token',
  role: 'any_role'
})
const makeFakeQueryId = (): LoadAccountByIdModel => ({
  id: 'any_id',
  role: 'any_role'
})
const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

describe('DBLoadAccountByToken Use Case tests', () => {
  test('should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const query = makeFakeQueryToken()
    await sut.load(query)
    expect(decryptSpy).toHaveBeenCalledWith(query.token)
  })
  test('should return null if Decryter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load(makeFakeQueryToken())
    expect(account).toBeNull()
  })
  test('should call AccountMongoRepository with correct values', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(accountMongoRepositoryStub, 'loadById')
    await sut.load(makeFakeQueryToken())
    expect(loadByTokenSpy).toHaveBeenCalledWith(makeFakeQueryId())
  })
  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut()
    jest.spyOn(accountMongoRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load(makeFakeQueryToken())
    await expect(promise).rejects.toThrow()
  })
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(makeFakeQueryToken())
    expect(account).toEqual(makeFakeAccount())
  })
})
