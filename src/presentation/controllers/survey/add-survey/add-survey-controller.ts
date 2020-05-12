import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'
import { serverError } from '../../../helpers'

export class AddSurveyController implements Controller {
  constructor (
    private readonly addSurvey: AddSurveyRepository
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = request
      await this.addSurvey.add(body)
      return await Promise.resolve({
        statusCode: 204
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
