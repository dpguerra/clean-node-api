import { Router } from 'express'
import { adapterRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey-factory'

export default (router: Router): void => {
  router.post('/survey/add', adapterRoute(makeAddSurveyController()))
}
