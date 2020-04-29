import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) { }
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      console.log('Erro!')
    }
    return response
  }
}
