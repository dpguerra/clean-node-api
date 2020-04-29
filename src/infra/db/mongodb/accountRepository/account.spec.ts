import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'

describe('Account MongoDB Repository', () => {
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

  const makeSut = (): AddAccountRepository => {
    return new AccountMongoRepository()
  }

  test('should returns an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@exemple.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@exemple.com')
    expect(account.password).toBe('any_password')
  })
})
