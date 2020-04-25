import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelper'

export class SignUpController {
  handle (request: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    return { statusCode: 200 }
  }
}
