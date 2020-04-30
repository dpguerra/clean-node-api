import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError } from '../../helpers'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../signup/signUpProtocols'

export class LogInController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = request.body
    try {
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
    return await Promise.resolve({ statusCode: 200, body: '' })
  }
}
