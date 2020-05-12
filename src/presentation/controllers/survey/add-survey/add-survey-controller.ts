import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'

export class AddSurveyController implements Controller {
  constructor (
    private readonly addSurvey: AddSurveyRepository
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { body } = request
    await this.addSurvey.add(body)
    return await Promise.resolve({
      statusCode: 204
    })
  }
}
