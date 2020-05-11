import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-decorator'
import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error'
import { makeValidationCompose } from './login-validation'
import { LogInController } from '../../../../presentation/controllers/ident/login/login-controller'
import { makeDBAuthenticate } from '../../usecases/authenticate/db-authenticate-factory'

export const makeLogInController = (): Controller => {
  const loginController = new LogInController(makeDBAuthenticate(), makeValidationCompose())
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logErrorMongoRepository)
}
