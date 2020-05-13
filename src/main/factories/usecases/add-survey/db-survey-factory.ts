import { DBAddSurvey } from '../../../../data/usecases/survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb//survey-repository/survey-mongo-repository'

export const makeDbAddSurvey = (): DBAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DBAddSurvey(surveyMongoRepository)
}
