import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError, ok, unauthorized } from '../../helpers'
import { MissingParamError, InvalidParamError, InvalidUserOrPassword } from '../../errors'
import { EmailValidator } from '../signup/signUpProtocols'
import { Authentication } from '../../../domain/usecases/authentication'

export class LogInController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly authentication: Authentication) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email, password } = request.body
    try {
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      return ok(await this.authentication.auth(email, password))
    } catch (error) {
      if (error === 'unauthorized') {
        return unauthorized(new InvalidUserOrPassword())
      }
      console.error(error)
      return serverError(error)
    }
  }
}
