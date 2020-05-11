import { Authenticate, Controller, HttpResponse, HttpRequest, AddAccount } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbiden } from '../../helpers'
import { Validation } from '../../protocols/validation'
import { EmailAlreadyInUse } from '../../../data/errors/duplicated-email-error'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation<Error>, private readonly authenticate: Authenticate) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(request.body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      const { name, email, password } = request.body
      await this.addAccount.add({ name, email, password })
      return ok(await this.authenticate.auth({ email, password }))
    } catch (error) {
      if (error.name === 'EmailAlreadyInUse') {
        return forbiden(new EmailAlreadyInUse(request.body.email))
      }
      console.error(error)
      return serverError(error)
    }
  }
}
