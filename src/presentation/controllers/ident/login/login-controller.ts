import { badRequest, serverError, ok, unauthorized } from '../../../helpers'
import { InvalidUserOrPassword } from '../../../../data/errors/invalid-user-or-email-error'
import { Authenticate, Controller, HttpRequest, HttpResponse } from './login-controller-protocols'
import { Validation } from '../../../../domain/usecases/validate/validation'

export class LogInController implements Controller {
  constructor (private readonly authenticate: Authenticate, private readonly validation: Validation<Error>) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(request.body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      const { email, password } = request.body
      return ok(await this.authenticate.auth({ email, password }))
    } catch (error) {
      if (error.name === 'InvalidUserOrPassword') {
        return unauthorized(new InvalidUserOrPassword())
      }
      console.error(error)
      return serverError(error)
    }
  }
}
