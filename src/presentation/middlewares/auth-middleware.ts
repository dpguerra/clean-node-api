import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { forbiden, proceed } from '../helpers'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/account/load-account-usecase'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const accessToken = request.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        const { id } = account
        return await Promise.resolve(proceed({ id }))
      }
    }
    return await Promise.reject(forbiden(new AccessDeniedError()))
  }
}
