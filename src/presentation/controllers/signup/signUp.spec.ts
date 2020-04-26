import { SignUpController } from './signUp'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signUpProtocols'

const makeEmailValidator = (should: boolean): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return should
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password: 'valid_password'
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator(true)
  const addAccountStub = makeAddAccount()
  return {
    sut: new SignUpController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return code 400 and a error if no name is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'nome@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  test('should return code 400 and a error if no email is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  test('should return code 400 and a error if no password is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
  test('should return code 400 and a error if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        password: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('should return code 400 and a error if password confirmation fails', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        password: 'password',
        passwordConfirmation: 'password_wrong'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('should return code 400 and a error if email provided is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'invalid_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'any_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith(request.body.email)
  })
  test('should return code 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'any_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
  test('should call AddAcount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Nome Qualquer',
      email: 'nome@example.com',
      password: 'password'
    })
  })
  test('should return code 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await Promise.reject(new Error())
    })
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'any_email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
  test('should return code 200 if all values passed', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@exemple.com',
      password: 'valid_password'
    })
  })
})
