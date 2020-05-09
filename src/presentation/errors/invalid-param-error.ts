export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid field: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}
