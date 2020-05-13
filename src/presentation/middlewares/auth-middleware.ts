import { HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { forbiden, proceed, serverError } from '../helpers'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken, LoadAccountByTokenModel } from '../../domain/usecases/account/load-account-usecase'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = request.headers?.['x-access-token']
      const query: LoadAccountByTokenModel = {
        token: request.headers?.['x-access-token'],
        role: this.role
      }
      if (accessToken) {
        const account = await this.loadAccountByToken.load(query)
        if (account) {
          const { id } = account
          return await Promise.resolve(proceed({ id }))
        }
      }
    } catch (error) {
      return await Promise.reject(serverError(error))
    }
    return await Promise.reject(forbiden(new AccessDeniedError()))
  }
}
