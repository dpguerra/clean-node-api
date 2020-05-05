import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly repository: LogErrorRepository) { }
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      const { id } = await this.repository.logError(response.body.stack)
      response.body.traceId = id
    }
    return response
  }
}
