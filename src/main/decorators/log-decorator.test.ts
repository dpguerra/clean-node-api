import { EmailValidatorAdapter } from '../adapters/email-validator-adapater'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { DbAddAccount } from '../../data/usecases/account/db-add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { LogControllerDecorator } from './log-decorator'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Controller } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailFormatValidation } from '../../presentation/helpers/validation'

interface SutTypes {
  sut: LogControllerDecorator
  signUpController: Controller
}

const makeSut = (): SutTypes => {
  const salt = 12
  const emailValidatorAdapater = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const validation = new ValidationCompose([
    new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
    new ComparedFieldsValidation('password', 'passwordConfirmation'),
    new EmailFormatValidation('email', emailValidatorAdapater)
  ])
  const signUpController = new SignUpController(dbAddAccount, validation)
  const dbLogErorRepository = new LogErrorMongoRepository()
  return {
    sut: new LogControllerDecorator(signUpController, dbLogErorRepository),
    signUpController
  }
}

describe('Log Controller Decorator', () => {
  const mongod = new MongoMemoryServer()

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('should returns un new id on success', async () => {
    const { sut, signUpController } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    jest.spyOn(signUpController, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const response = await sut.handle(request)
    expect(response.body.traceId).toBeDefined()
  })
})
