import { LogInController } from './logIn'
import { badRequest } from '../../helpers'
import { MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { HttpRequest } from '../../protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
interface SutTypes {
  sut: LogInController
  emailValidatorStub: EmailValidator
}

const makeSup = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  return {
    sut: new LogInController(emailValidatorStub),
    emailValidatorStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@exemple.com',
    password: 'valid_password'
  }
})

describe('LogIn Controller', () => {
  test('should returns 400 and an error if no email is passed', async () => {
    const { sut } = makeSup()
    const request = {
      body: {
        password: 'valid_password'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should returns 400 and an error if no password is passed', async () => {
    const { sut } = makeSup()
    const request = {
      body: {
        email: 'valid_email@exemple.com'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should call EmailValidator with corrects params', async () => {
    const { sut, emailValidatorStub } = makeSup()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('valid_email@exemple.com')
  })
})
