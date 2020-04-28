import { AddAccountModel, AddAccount, AccountModel, Encrypter } from './dbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve({ id: 'valid_id', name: 'valid_name', email: 'valid_email', password: 'valid_password' })
  }
}
