import { serverError, badRequest, noContent } from '../../../helpers'
import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly addSurvey: AddSurvey,
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
      return await Promise.resolve(noContent())
    } catch (error) {
      return serverError(error)
    }
  }
}
