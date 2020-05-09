import env from '../../../config/env'
import { BCryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { DBAuthenticate } from '../../../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapater'

export const makeDBAuthenticate = (): DBAuthenticate => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const enctrypter = new JwtAdapter(env.jwtSecret)
  return new DBAuthenticate(accountMongoRepository, bCryptAdapter, enctrypter, accountMongoRepository)
}
