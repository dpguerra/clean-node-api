import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoUrl)
  .then(
    async () => {
      const accountCollection = await MongoHelper.getCollection('accounts')
      if (!await accountCollection.indexExists('email')) {
        await accountCollection.createIndex({ email: 1 }, { unique: true })
      }
      const app = (await import('./config/app')).default
      app.listen(env.port, () => console.log(`Listening on http://localhost:${env.port}...`))
    }
  )
  .catch(console.error)
