import { serverError } from '../../../../presentation/helpers'
import { MongoHelper } from '../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { LogErrorRepository } from '../../../../data/protocols/logErrorRepository'
import { LogErrorMongoRepository } from './logError'

const makeSut = (): LogErrorRepository => {
  return new LogErrorMongoRepository()
}
describe('Log Error MongoDB Repository', () => {
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
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('should returns un new id on success', async () => {
    const sut = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const result = await sut.logError(error.body.stack)
    expect(result).toHaveProperty('id')
  })
})
