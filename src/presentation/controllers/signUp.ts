import { Controller, EmailValidator, HttpResponse, HttpRequest } from '../protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { badRequest } from '../helpers'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (request: HttpRequest): HttpResponse {
    try {
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
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
