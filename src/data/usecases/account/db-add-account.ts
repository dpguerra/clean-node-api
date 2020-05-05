import { AddAccountModel, AddAccount, AccountModel, Hasher } from './db-add-account-protocols'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}
  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
