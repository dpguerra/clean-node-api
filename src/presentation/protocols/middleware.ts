import { HttpResponse, HttpRequest } from './'

export interface Middleware {
  handle(request: HttpRequest): Promise<HttpResponse>
}
