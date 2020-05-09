import { DbAddAccount } from '../../../../data/usecases/account/db-add-account'
import { BCryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bCryptAdapter, accountMongoRepository)
}
