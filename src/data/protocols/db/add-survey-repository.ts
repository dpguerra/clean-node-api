import { AddSurveyModel } from '../../../domain/usecases/survey/survey-usecase'

export interface AddSurveyRepository {
  add (account: AddSurveyModel): Promise<void>
}
