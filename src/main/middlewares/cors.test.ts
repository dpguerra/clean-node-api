import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.get('/test_cors', (_req: any, res: any) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
