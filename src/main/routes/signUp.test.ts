import request from 'supertest'
import app from '../config/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mangoHelper'

describe('SignUp Routes', () => {
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
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      })
      .expect(201)
  })
})
