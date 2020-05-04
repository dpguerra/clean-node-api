import { LogErrorRepository, LogErrorReturnModel } from '../../../../data/protocols/db/logErrorRepository'
import { MongoHelper } from '../helpers/mongoHelper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<LogErrorReturnModel> {
    const accountCollection = await MongoHelper.getCollection('errors')
    const { ops } = await accountCollection.insertOne({ stack, date: new Date() })
    return MongoHelper.map(ops[0])
  }
}
