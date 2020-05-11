export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing field: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
