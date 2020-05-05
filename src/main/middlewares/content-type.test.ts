import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as JSON', async () => {
    app.get('/test_content_type', (_req: any, res: any) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
  test('should return XML content type when forced', async () => {
    app.get('/test_content_type_xml', (_req: any, res: any) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
