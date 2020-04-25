import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'

export class SignUpController {
  handle (request: HttpRequest): HttpResponse {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!request.body.email) {
      return badRequest(new MissingParamError('email'))
    }
    return { statusCode: 200 }
  }
}
