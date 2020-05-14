import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-decorator'
import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error'
import { makeValidationCompose } from './add-survey-validation'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const signUpController = new AddSurveyController(makeDbAddSurvey(), makeValidationCompose())
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}
