import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hashComparer'
import { DBAuthenticate } from './dbAuthenticate'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { UpdateTokenRepository } from '../../protocols/db/updateTokenRepository'

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
    async load (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

const makeHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (password: string, hashedPassword: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('any_valid_token')
    }
  }
  return new EncrypterStub()
}

const makeUpdateTokenRepository = (): UpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements UpdateTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateTokenRepositoryStub()
}
interface SutTypes {
  sut: Authentication
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateTokenRepositoryStub: UpdateTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository()
  const hashCompareStub = makeHashCompare()
  const encrypterStub = makeEncrypter()
  const updateTokenRepositoryStub = makeUpdateTokenRepository()
  return {
    sut: new DBAuthenticate(loadAccountByIdRepositoryStub, hashCompareStub, encrypterStub, updateTokenRepositoryStub),
    loadAccountByIdRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateTokenRepositoryStub
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
  test('should reject if LoadAccountByIdRepository returns no account', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const credential = makeFakeCredential()
    const token = sut.auth(credential)
    await expect(token).rejects.toEqual(Error('unauthorized'))
  })
  test('should call HashCompare with corrects values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const loadSpy = jest.spyOn(hashCompareStub, 'compare')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    await sut.auth(credential)
    expect(loadSpy).toBeCalledWith(credential.password, account.password)
  })
  test('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
  test('should reject if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const credential = makeFakeCredential()
    const token = sut.auth(credential)
    await expect(token).rejects.toEqual(Error('unauthorized'))
  })
  test('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    await sut.auth(credential)
    expect(encryptSpy).toBeCalledWith(account.id)
  })
  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
  test('should return a valid token if succeds', async () => {
    const { sut } = makeSut()
    const credential = makeFakeCredential()
    const token = await sut.auth(credential)
    expect(token).toBe('any_valid_token')
  })
  test('should call UpdateTokenRepository with corrects values', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateTokenRepositoryStub, 'update')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    const token = await sut.auth(credential)
    expect(updateSpy).toBeCalledWith(account.id, token)
  })
  test('should throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'update').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
})
