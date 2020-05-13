import { Middleware } from '../protocols/middleware'
import { HttpRequest, HttpResponse } from '../protocols'
import { forbiden } from '../helpers'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return await Promise.reject(forbiden(new AccessDeniedError()))
  }
}
