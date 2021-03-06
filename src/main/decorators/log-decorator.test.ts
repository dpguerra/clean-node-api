import env from '../config/env'
import { EmailValidatorAdapter } from '../adapters/email-validator-adapater'
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-mongo-repository'
import { DbAddAccount } from '../../data/usecases/account/db-add-account'
import { SignUpController } from '../../presentation/controllers/ident/signup/signup-controller'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error-repository/log-error'
import { LogControllerDecorator } from './log-decorator'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Controller } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailFormatValidation } from '../../data/usecases/validate'
import { DBAuthenticate } from '../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../infra/criptography/jwt-adapater'
import { Collection } from 'mongodb'

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
  const hashCompare = new BCryptAdapter(salt)
  const enctrypter = new JwtAdapter(env.jwtSecret)
  const dbAuthenticate = new DBAuthenticate(accountMongoRepository, hashCompare, enctrypter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, validation, dbAuthenticate)
  const dbLogErorRepository = new LogErrorMongoRepository()
  return {
    sut: new LogControllerDecorator(signUpController, dbLogErorRepository),
    signUpController
  }
}

describe('Log Controller Decorator', () => {
  const mongod = new MongoMemoryServer()
  let accountCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.createIndex({ email: 1 }, { unique: true })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
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
