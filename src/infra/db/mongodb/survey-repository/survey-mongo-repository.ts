import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases/survey/survey-usecase'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
    return await Promise.resolve()
  }
}
