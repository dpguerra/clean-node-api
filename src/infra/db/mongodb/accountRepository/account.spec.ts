import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mangoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'

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

  test('should returns an account on success', async () => {
    const sut = new AccountMongoRepository()
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
