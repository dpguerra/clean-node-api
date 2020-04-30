import { LogInController } from './logIn'
import { HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: LogInController
}

const makeSup = (): SutTypes => {
  return {
    sut: new LogInController()
  }
}

describe('LogIn Controller', () => {
  test('should returns 400 and an error if no email is passed', async () => {
    const { sut } = makeSup()
    const request: HttpRequest = {
      body: {
        password: 'valid_password'
      }
    }
    const reponse: HttpResponse = await sut.handle(request)
    expect(reponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should returns 400 and an error if no password is passed', async () => {
    const { sut } = makeSup()
    const request: HttpRequest = {
      body: {
        email: 'valid_email@exemple.com'
      }
    }
    const reponse: HttpResponse = await sut.handle(request)
    expect(reponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
