import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  connection: null as unknown as MongoClient,
  async connect (uri: string): Promise<void> {
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    await this.connection.close()
  },
  getCollection (name: string): Collection {
    return this.connection.db().collection(name)
  }
}
