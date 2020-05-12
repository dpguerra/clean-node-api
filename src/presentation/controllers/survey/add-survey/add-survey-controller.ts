import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'
import { serverError, badRequest } from '../../../helpers'
import { Validation } from '../../ident/login/login-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly addSurvey: AddSurveyRepository,
    private readonly validation: Validation<Error>
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = request
      const validationResult = this.validation.validate(body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      await this.addSurvey.add(body)
      return await Promise.resolve({
        statusCode: 204
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
