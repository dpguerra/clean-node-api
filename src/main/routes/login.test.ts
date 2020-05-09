import request from 'supertest'
import app from '../config/app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
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
  describe('POST /signup', () => {
    test('should return an account on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid_name',
          email: 'valid_email@exemple.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        })
        .expect(200)
    })
    test('should return an error if email exists', async () => {
      const password = await hash('valid_password', 12)
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'valid_name',
          email: 'valid_email@exemple.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password'
        })
        .expect(403)
    })
  })
  describe('POST /login', () => {
    test('should return an account on success', async () => {
      const password = await hash('valid_password', 12)
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid_email@exemple.com',
          password: 'valid_password'
        })
        .expect(200)
    })
    test('should return an error on fail', async () => {
      const password = await hash('valid_password', 12)
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@exemple.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid_email@exemple.com',
          password: 'invalid_password'
        })
        .expect(401)
    })
  })
})
