import { HttpResponse, HttpRequest } from './http'

export interface Controller {
  handle(request: HttpRequest): HttpResponse
}
