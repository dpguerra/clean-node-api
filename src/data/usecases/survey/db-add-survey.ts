import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey/survey-usecase'
import { AddSurveyRepository } from '../../protocols/db/add-survey-repository'

export class DBAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) { }

  async add (account: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(account)
    return await Promise.resolve()
  }
}
