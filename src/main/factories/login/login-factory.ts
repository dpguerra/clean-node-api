import env from '../../config/env'
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-decorator'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error-repository/log-error'
import { makeValidationCompose } from './login-validation'
import { LogInController } from '../../../presentation/controllers/login/login-controller'
import { DBAuthenticate } from '../../../data/usecases/authenticate/db-authenticate'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapater'

export const makeLogInController = (): Controller => {
  const salt = 12
  const accountMongoRepository = new AccountMongoRepository()
  const hashCompare = new BCryptAdapter(salt)
  const enctrypter = new JwtAdapter(env.jwtSecret)
  const dbAuthenticate = new DBAuthenticate(accountMongoRepository, hashCompare, enctrypter, accountMongoRepository)
  const loginController = new LogInController(dbAuthenticate, makeValidationCompose())
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorMongoRepository)
}
