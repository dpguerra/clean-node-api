import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { ops } = await accountCollection.insertOne(account)
    return MongoHelper.map(ops[0])
  }
}
