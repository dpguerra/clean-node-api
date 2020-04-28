import { AddAccountModel, AddAccount } from '../../../domain/usecases/addAccount'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve({ id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'valid_password' })
  }
}
