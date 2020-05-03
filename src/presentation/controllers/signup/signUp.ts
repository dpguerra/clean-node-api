import { Controller, HttpResponse, HttpRequest, AddAccount } from './signUpProtocols'
import { badRequest, serverError, created } from '../../helpers'
import { Validation } from '../../protocols/validation'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation<Error>) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validation.validate(request.body)
      if (validationResult) {
        return badRequest(validationResult)
      }
      const { name, email, password } = request.body
      const account = await this.addAccount.add({ name, email, password })
      return created(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
