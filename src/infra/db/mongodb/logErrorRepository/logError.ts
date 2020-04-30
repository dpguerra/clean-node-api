import { LogErrorRepository, LogErrorReturnModel } from '../../../../data/protocols/logErrorRepository'
import { MongoHelper } from '../helpers/mongoHelper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<LogErrorReturnModel> {
    const accountCollection = await MongoHelper.getCollection('erros')
    const { ops } = await accountCollection.insertOne({ stack, date: new Date() })
    return MongoHelper.map(ops[0])
  }
}
