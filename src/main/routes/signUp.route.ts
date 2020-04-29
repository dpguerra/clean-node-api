import { Router } from 'express'
import { adapterRoute } from '../adapters/expressRouteAdapter'
import { makeSignUpController } from '../factories/signUp'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignUpController()))
}
