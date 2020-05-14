import { LoadAccountByToken, LoadAccountByTokenModel } from '../../../domain/usecases/account/load-account-usecase'
import { LoadAccountByTokenRepository } from '../../protocols/db/load-account-by-token-repository'
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
const makeAccountMongoRepository = (): LoadAccountByTokenRepository => {
  class AccountMongoRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (query: LoadAccountByTokenModel): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AccountMongoRepositoryStub()
}

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  accountMongoRepositoryStub: LoadAccountByTokenRepository
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
const makeFakeQuery = (): LoadAccountByTokenModel => ({
  token: 'any_token',
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
    const query = makeFakeQuery()
    await sut.load(query)
    expect(decryptSpy).toHaveBeenCalledWith(query.token)
  })
  test('should call AccountMongoRepository with correct values', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(accountMongoRepositoryStub, 'loadByToken')
    const query = makeFakeQuery()
    await sut.load(query)
    expect(loadByTokenSpy).toHaveBeenCalledWith(query)
  })
  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, accountMongoRepositoryStub } = makeSut()
    jest.spyOn(accountMongoRepositoryStub, 'loadByToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load(makeFakeQuery())
    await expect(promise).rejects.toThrow()
  })
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(makeFakeQuery())
    expect(account).toEqual(makeFakeAccount())
  })
})
