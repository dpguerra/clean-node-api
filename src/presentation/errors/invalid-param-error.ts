export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid field: ${paramName}`)
    this.name = 'InvalidParamError'
  }
}

export class InvalidUserOrPassword extends Error {
  constructor () {
    super('Invalid user or password')
    this.name = 'InvalidUserOrPassword'
  }
}
