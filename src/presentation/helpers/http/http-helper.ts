import { HttpResponse } from '../../protocols'
import { ServerError } from '../../errors'

export const proceed = (): HttpResponse => ({
  statusCode: 100
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: error.message }
})

export const unauthorized = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: { error: error.message }
})

export const forbiden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: { error: error.message }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
