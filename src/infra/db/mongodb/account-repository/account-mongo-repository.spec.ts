import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddAccountModel } from '../../../../domain/usecases/account/account-usecase'
import { Collection } from 'mongodb'

describe('Account MongoDB Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  const makeFakeAccount = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email@exemple.com',
    password: 'any_password',
    role: 'any_role'
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
      expect(account?.id).toBeTruthy()
    })
    test('should returns null on fail', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@exemple.com')
      expect(account).toBeFalsy()
    })
  })
  describe('LoadById Method', () => {
    test('should returns an account on success query with id and role', async () => {
      const { ops } = await accountCollection.insertOne(makeFakeAccount())
      const { id } = MongoHelper.map(ops[0])
      const role = 'any_role'
      const sut = makeSut()
      const account = await sut.loadById({ id, role })
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
    })
  })
  describe('UpdateToken Method', () => {
    test('should returns void on success', async () => {
      const { ops } = await accountCollection.insertOne(makeFakeAccount())
      const { id } = MongoHelper.map(ops[0])
      const sut = makeSut()
      await sut.updateToken(id, 'valid_token')
      const account = await accountCollection.findOne({ _id: id })
      expect(account.token).toBe('valid_token')
    })
  })
})
