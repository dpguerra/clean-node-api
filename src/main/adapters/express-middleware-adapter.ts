import { Middleware, HttpRequest } from '../../presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const adapterMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req?.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 100) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
