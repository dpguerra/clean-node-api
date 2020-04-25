import { Controller, EmailValidator, HttpResponse, HttpRequest } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest } from '../helpers'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    if (!this.emailValidator.isValid(request.body.email)) {
      return badRequest(new InvalidParamError('email'))
    }
    return { statusCode: 200 }
  }
}
