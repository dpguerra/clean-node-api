import { SignUpController } from '../../presentation/controllers/signup/signUp'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapater'
import { DbAddAccount } from '../../data/usecases/addAccount/dbAddAccount'
import { BCryptAdapter } from '../../infra/criptography/bCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapater = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bCryptAdapter, accountMongoRepository)
  return new SignUpController(emailValidatorAdapater, dbAddAccount)
}
