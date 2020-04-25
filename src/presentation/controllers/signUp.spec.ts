import { SignUpController } from './signUp'
import { MissingParamError } from '../errors/missingParamError'

describe('SignUp Controller', () => {
  test('should return code 400 and a error if no name is provided', () => {
    const sut = new SignUpController()
    const request = {
      body: {
        name: '',
        email: 'nome@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  test('should return code 400 and a error if no email is provided', () => {
    const sut = new SignUpController()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: '',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  test('should return code 400 and a error if no password is provided', () => {
    const sut = new SignUpController()
    const request = {
      body: {
        name: 'Nome Qualquer',
        email: 'nome@example.com',
        password: '',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
})
