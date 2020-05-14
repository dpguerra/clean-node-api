import request from 'supertest'
import app from '../config/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

describe('Survey Routes', () => {
  const mongod = new MongoMemoryServer()
  let surveyCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
    surveyCollection = await MongoHelper.getCollection('surveys')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })
  describe('POST /survey/add', () => {
    test('should return 403 without token', async () => {
      await request(app)
        .post('/api/survey/add')
        .send({
          question: 'valid_question',
          answers: [
            'valid_answer'
          ]
        })
        .expect(403)
    })
    test('should return 403 with an invalid token', async () => {
      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', 'invalid_token')
        .send({
          question: 'valid_question',
          answers: [
            'valid_answer'
          ]
        })
        .expect(403)
    })
  })
})
