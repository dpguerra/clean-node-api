import { HttpResponse, HttpRequest } from './'

export interface Controller {
  handle(request: HttpRequest): HttpResponse
}
