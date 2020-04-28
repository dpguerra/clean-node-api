import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should parser body as JSON', async () => {
    app.post('/test_body_parser', (req: { body: any }, res: { send: (arg0: any) => void }) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'PlataformaBR' })
      .expect({ name: 'PlataformaBR' })
  })
})
