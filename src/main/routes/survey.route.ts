import { Router } from 'express'
import { adapterRoute } from '../adapters/express-route-adapter'
import { adapterMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-factory'

export default (router: Router): void => {
  router.post('/survey/add', adapterMiddleware(makeAuthMiddleware('admin')), adapterRoute(makeAddSurveyController()))
}
