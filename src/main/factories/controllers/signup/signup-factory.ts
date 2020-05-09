import env from '../../../config/env'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../../data/usecases/account/db-add-account'
import { BCryptAdapter } from '../../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-decorator'
import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error'
import { makeValidationCompose } from './signup-validation'
import { DBAuthenticate } from '../../../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapater'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const validation = makeValidationCompose()
  const enctrypter = new JwtAdapter(env.jwtSecret)
  const dbAuthenticate = new DBAuthenticate(accountMongoRepository, bCryptAdapter, enctrypter, accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, validation, dbAuthenticate)
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}
