import { AddAccountModel, AddAccount, AccountModel, Encrypter } from './dbAddAccountProtocols'
import { AddAccountRepository } from '../../protocols/db/addAccountRepository'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    return await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
