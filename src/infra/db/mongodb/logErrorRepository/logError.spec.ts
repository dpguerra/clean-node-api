import { MongoHelper } from '../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { LogErrorRepository } from '../../../../data/protocols/db/logErrorRepository'
import { LogErrorMongoRepository } from './logError'
import { Collection } from 'mongodb'

const makeSut = (): LogErrorRepository => {
  return new LogErrorMongoRepository()
}
describe('Log Error MongoDB Repository', () => {
  const mongod = new MongoMemoryServer()
  let errorCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('should create a database entry', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
  test('should returns un new id on success', async () => {
    const sut = makeSut()
    const result = await sut.logError('any_stack')
    expect(result).toHaveProperty('id')
  })
})
