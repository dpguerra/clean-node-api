import { LogErrorRepository, LogErrorReturnModel } from '../../../../data/protocols/logErrorRepository'
import { MongoHelper } from '../helpers/mongoHelper'

export class DBLogErrorRepository implements LogErrorRepository {
  async log (stack: string): Promise<LogErrorReturnModel> {
    const accountCollection = await MongoHelper.getCollection('logs')
    const { ops } = await accountCollection.insertOne({ stack })
    return MongoHelper.map(ops[0])
  }
}
