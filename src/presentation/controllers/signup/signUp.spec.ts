import { SignUpController } from './signUp'
import { AccountModel, AddAccount, AddAccountModel } from './signUpProtocols'
import { HttpRequest } from '../../protocols'
import { created, serverError } from '../../helpers'
import { Validation } from '../../protocols/validation'

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

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation<Error>
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()

  return {
    sut: new SignUpController(addAccountStub, validationStub),
    addAccountStub,
    validationStub
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
  test('should return code 200 if all values passed', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(created(makeFakeAccount()))
  })
})
