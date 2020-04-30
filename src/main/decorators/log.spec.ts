import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError, created } from '../../presentation/helpers'
import { LogErrorRepository, LogErrorReturnModel } from '../../data/protocols/logErrorRepository'
import { AccountModel } from '../../domain/models/account'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

class LogErrorReposytoryStub implements LogErrorRepository {
  async log (stack: string): Promise<LogErrorReturnModel> {
    return await Promise.resolve({ id: 'any_id', stack: 'any_stack' })
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@exemple.com',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@exemple.com',
  password: 'hashed_password'
})

const makeLogRepository = (): LogErrorRepository => {
  return new LogErrorReposytoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(created(makeFakeAccount()))
    }
  }
  return new ControllerStub()
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogRepository()
  return {
    sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub),
    controllerStub,
    logErrorRepositoryStub

  }
}

describe('LogController Decorator', () => {
  test('should controller handle calls original contoller with correcs values', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })
  test('should return same results of controller', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(created(makeFakeAccount()))
  })
  test('should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValue(Promise.resolve(makeFakeServerError()))
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
