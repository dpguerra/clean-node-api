import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError, ok } from '../../helpers'
import { MissingParamError, InvalidParamError } from '../../errors'
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
      const token = await this.authentication.auth(email, password)
      if (token) {
        return ok(token)
      }
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
    return ({ statusCode: 200, body: '' })
  }
}
