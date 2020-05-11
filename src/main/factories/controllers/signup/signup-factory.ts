import { SignUpController } from '../../../../presentation/controllers/ident/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators/log-decorator'
import { LogErrorMongoRepository } from '../../../../infra/db/mongodb/log-error-repository/log-error'
import { makeValidationCompose } from './signup-validation'
import { makeDBAuthenticate } from '../../usecases/authenticate/db-authenticate-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-account-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeValidationCompose(), makeDBAuthenticate())
  const logErrorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorMongoRepository)
}
