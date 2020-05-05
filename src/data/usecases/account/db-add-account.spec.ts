import { DbAddAccount } from './db-add-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/account'
import { AccountModel } from './db-add-account-protocols'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'

interface SutTypes {
  sut: AddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@exemple.com',
  password: 'hashed_password'
})

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@exemple.com',
  password: 'valid_password'
})

const makeFakeAddedAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@exemple.com',
  password: 'hashed_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStup implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStup()
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAddAccount())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })
  test('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeAddAccount())
    await expect(promise).rejects.toThrow()
  })
  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAddAccount())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddedAccount())
  })
  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeAddAccount())
    await expect(promise).rejects.toThrow()
  })
  test('should returns added account with correct values', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toEqual(makeFakeAccount())
  })
})
