import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  connection: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    await this.connection.close()
    // this.connection = null
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.connection.isConnected()) {
      await this.connect(this.uri)
    }
    return this.connection.db().collection(name)
  },
  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
