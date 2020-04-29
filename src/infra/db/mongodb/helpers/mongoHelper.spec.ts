import { MongoHelper as sut } from './mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Mongo Helper', () => {
  const mongod = new MongoMemoryServer()
  beforeAll(async () => await sut.connect(await mongod.getUri()))
  afterAll(async () => {
    await sut.disconnect()
    await mongod.stop()
  })

  test('should recconect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(await accountCollection.insertOne({ test: 'teste' })).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(await accountCollection.insertOne({ test: 'teste' })).toBeTruthy()
  })
})
