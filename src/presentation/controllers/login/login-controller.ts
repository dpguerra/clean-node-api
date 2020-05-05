import { badRequest, serverError, ok, unauthorized } from '../../helpers'
import { InvalidUserOrPassword } from '../../errors'
import { Authentication, Controller, HttpRequest, HttpResponse } from './login-controller-protocols'
import { Validation } from '../../protocols/validation'

export class LogInController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation<Error>) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(request.body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      const { email, password } = request.body
      return ok(await this.authentication.auth({ email, password }))
    } catch (error) {
      if (error === 'unauthorized') {
        return unauthorized(new InvalidUserOrPassword())
      }
      console.error(error)
      return serverError(error)
    }
  }
}
