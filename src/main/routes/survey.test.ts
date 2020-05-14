import request from 'supertest'
import app from '../config/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

describe('Survey Routes', () => {
  const mongod = new MongoMemoryServer()
  let surveyCollection: Collection
  let accountCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.createIndex({ email: 1 }, { unique: true })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
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
    test('should return 403 with a valid token and user has no admin role', async () => {
      const { ops } = await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password: 'any_password'
      })
      const id = ops[0]._id
      const token = sign({ id }, env.jwtSecret)
      console.log(token)
      await accountCollection.updateOne({
        _id: id
      }, {
        $set: { token }
      })
      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', token)
        .send({
          question: 'valid_question',
          answers: [
            'valid_answer'
          ]
        })
        .expect(403)
    })
    test('should return 204 with a valid token and user has admin role', async () => {
      const { ops } = await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password: 'any_password',
        role: 'admin'
      })
      const id = ops[0]._id
      const token = sign({ id }, env.jwtSecret)
      console.log(token)
      await accountCollection.updateOne({
        _id: id
      }, {
        $set: { token }
      })
      await request(app)
        .post('/api/survey/add')
        .set('x-access-token', token)
        .send({
          question: 'valid_question',
          answers: [
            'valid_answer'
          ]
        })
        .expect(204)
    })
  })
})
