import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddAccountModel } from '../../../../domain/usecases/account'
import { Collection } from 'mongodb'

describe('Account MongoDB Repository', () => {
  const mongod = new MongoMemoryServer()
  let accountCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  const makeFakeAccount = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email@exemple.com',
    password: 'any_password'
  })

  describe('Add Method', () => {
    test('should returns an account on success', async () => {
      const sut = makeSut()
      const account = await sut.add(makeFakeAccount())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@exemple.com')
      expect(account.password).toBe('any_password')
    })
  })
  describe('LoadByEmail Method', () => {
    test('should returns an account on success', async () => {
      await accountCollection.insertOne(makeFakeAccount())
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@exemple.com')
      expect(account).toBeTruthy()
    })
    test('should returns null on fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@exemple.com')
      expect(account).toBeFalsy()
    })
  })
})
