import { Router } from 'express'
import { adapterRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/signup/signup-factory'
import { makeLogInController } from '../factories/controllers/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
  router.post('/login', adapterRoute(makeLogInController()))
}
