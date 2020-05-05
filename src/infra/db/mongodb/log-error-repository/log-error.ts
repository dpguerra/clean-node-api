import { LogErrorRepository, LogErrorReturnModel } from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<LogErrorReturnModel> {
    const accountCollection = await MongoHelper.getCollection('errors')
    const { ops } = await accountCollection.insertOne({ stack, date: new Date() })
    return MongoHelper.map(ops[0])
  }
}
