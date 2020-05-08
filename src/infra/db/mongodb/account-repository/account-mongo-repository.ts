import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateTokenRepository } from '../../../../data/protocols/db/update-token-repository'
import { EmailAlreadyInUse } from '../../../../presentation/errors'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateTokenRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    try {
      const { ops } = await accountCollection.insertOne(account)
      return MongoHelper.map(ops[0])
    } catch (error) {
      return await Promise.reject(new EmailAlreadyInUse(account.email))
    }
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      { $set: { token } }
    )
  }
}
