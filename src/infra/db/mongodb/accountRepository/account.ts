import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository'
import { AddAccountModel } from '../../../../domain/usecases/addAccount'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { ops } = await accountCollection.insertOne(account)
    return MongoHelper.map(ops[0])
  }
}
