import { AddAccountRepository } from '../../../../data/protocols/addAccountRepository'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { AccountModel } from '../../../../domain/models/account'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await Promise.resolve({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@exemple.com',
      password: 'any_password'
    })
  }
}
