import { AddSurveyModel } from '../../../domain/usecases/survey/survey-usecase'

export interface AddSurveyRepository {
  add (survey: AddSurveyModel): Promise<void>
}
