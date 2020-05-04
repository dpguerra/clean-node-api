import { SignUpController } from '../../presentation/controllers/signup/signUp'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapater'
import { DbAddAccount } from '../../data/usecases/addAccount/dbAddAccount'
import { BCryptAdapter } from '../../infra/criptography/bCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account'
import { Controller } from '../../presentation/protocols/controller'
import { LogControllerDecorator } from '../decorators/log'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/logErrorRepository/logError'
import { ValidationCompose, RequiredFieldsValidation, ComparedFieldsValidation, EmailValidation } from '../../presentation/helpers/validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapater = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  const validation = new ValidationCompose([
    new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
    new ComparedFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation(emailValidatorAdapater)
  ])
  const signUpController = new SignUpController(dbAddAccount, validation)
  const LogErorMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, LogErorMongoRepository)
}
