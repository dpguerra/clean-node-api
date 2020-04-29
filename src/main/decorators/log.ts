import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorReposytory } from '../../data/protocols/logErrorRepository'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly repository: LogErrorReposytory) { }
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      await this.repository.log(response.body.stack)
    }
    return response
  }
}
