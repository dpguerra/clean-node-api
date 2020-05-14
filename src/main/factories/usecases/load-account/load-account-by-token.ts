import { DBLoadAccountByToken } from '../../../../data/usecases/account/db-load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapater'
import env from '../../../config/env'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'

export const makeDBLoadAccountByToken = (): DBLoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DBLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
