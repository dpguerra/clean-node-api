import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helpers'
import { MissingParamError } from '../../errors'

export class LogInController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return await Promise.resolve({ statusCode: 200, body: '' })
  }
}
