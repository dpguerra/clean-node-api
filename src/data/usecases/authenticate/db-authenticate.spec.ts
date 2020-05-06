import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authenticate, AuthenticateModel } from '../../../domain/usecases/authenticate'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { DBAuthenticate } from './db-authenticate'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { UpdateTokenRepository } from '../../protocols/db/update-token-repository'
import { InvalidUserOrPassword } from '../../../presentation/errors'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_hashed_password'
})
const makeFakeCredential = (): AuthenticateModel => ({
  email: 'any_email',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
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
    async encrypt (value: Object): Promise<string> {
      return await Promise.resolve('any_valid_token')
    }
  }
  return new EncrypterStub()
}

const makeUpdateTokenRepository = (): UpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements UpdateTokenRepository {
    async updateToken (id: string, token: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateTokenRepositoryStub()
}
interface SutTypes {
  sut: Authenticate
  loadAccountByIdRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateTokenRepositoryStub: UpdateTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByEmailRepository()
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
  test('should call LoadAccountByEmailRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadByEmail')
    const credential = makeFakeCredential()
    await sut.auth(credential)
    expect(loadByEmailSpy).toBeCalledWith(credential.email)
  })
  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
  test('should reject if LoadAccountByEmailRepository returns no account', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const credential = makeFakeCredential()
    const token = sut.auth(credential)
    await expect(token).rejects.toEqual(new InvalidUserOrPassword())
  })
  test('should call HashCompare with corrects values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(hashCompareStub, 'compare')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    await sut.auth(credential)
    expect(loadByEmailSpy).toBeCalledWith(credential.password, account.password)
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
    await expect(token).rejects.toEqual((new InvalidUserOrPassword()))
  })
  test('should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const credential = makeFakeCredential()
    const { id } = makeFakeAccount()
    await sut.auth(credential)
    expect(encryptSpy).toBeCalledWith({ id })
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
    const result = await sut.auth(credential)
    const token = 'any_valid_token'
    expect(result).toEqual({ token })
  })
  test('should call UpdateTokenRepository with corrects values', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    const updateTokenSpy = jest.spyOn(updateTokenRepositoryStub, 'updateToken')
    const credential = makeFakeCredential()
    const account = makeFakeAccount()
    const { token } = await sut.auth(credential)
    expect(updateTokenSpy).toBeCalledWith(account.id, token)
  })
  test('should throw if UpdateTokenRepository throws', async () => {
    const { sut, updateTokenRepositoryStub } = makeSut()
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockReturnValueOnce(Promise.reject(new Error()))
    const credential = makeFakeCredential()
    const promise = sut.auth(credential)
    await expect(promise).rejects.toThrow()
  })
})
