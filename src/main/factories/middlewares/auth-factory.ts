import { Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDBLoadAccountByToken } from '../usecases/load-account/load-account-by-token'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDBLoadAccountByToken(), role)
}
