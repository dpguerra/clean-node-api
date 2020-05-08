import env from './config/env'
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoUrl)
  .then(
    async () => {
      const app = (await import('./config/app')).default
      app.listen(env.port, () => console.log(`Listening on http://localhost:${env.port}...`))
      const accountCollection = await MongoHelper.getCollection('accounts')
      await accountCollection.createIndex({ email: 1 }, { unique: true })
    }
  )
  .catch(console.error)
