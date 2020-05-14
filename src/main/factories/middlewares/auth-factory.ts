import { Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { DBLoadAccountByToken } from '../../../data/usecases/account/db-load-account-by-token'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapater'
import env from '../../config/env'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountByToken = new DBLoadAccountByToken(jwtAdapter, accountMongoRepository)
  return new AuthMiddleware(dbLoadAccountByToken, role)
}
