import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
      const response = {
        statusCode: 200,
        body: {
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      return await Promise.resolve(response)
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  return {
    sut: new LogControllerDecorator(controllerStub),
    controllerStub

  }
}

describe('LogController Decorator', () => {
  test('should controller handle calls original contoller with correcs values', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })
  test('should return same results of controller', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response).toEqual({ statusCode: 200, ...request })
  })
})
