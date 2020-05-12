import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
export class DBAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) { }

  async add (account: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(account)
    return await Promise.resolve()
  }
}
