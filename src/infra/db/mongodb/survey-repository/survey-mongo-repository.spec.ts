import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddSurveyModel } from '../../../../domain/usecases/survey/survey-usecase'
import { Collection } from 'mongodb'

describe('Account MongoDB Repository', () => {
  const mongod = new MongoMemoryServer()
  let accountCollection: Collection

  beforeAll(async () => {
    const uri = await mongod.getUri()
    await MongoHelper.connect(uri)
    accountCollection = await MongoHelper.getCollection('surveys')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await accountCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }
  const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [
      'any_answer'
    ]
  })

  describe('Add Method', () => {
    test('should returns void on success', async () => {
      const sut = makeSut()
      const survey = await sut.add(makeFakeSurvey())
      expect(survey).toBeFalsy()
    })
  })
})
