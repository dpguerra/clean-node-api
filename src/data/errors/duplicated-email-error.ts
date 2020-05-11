export class EmailAlreadyInUse extends Error {
  constructor (paramName: string) {
    super(`${paramName} is already in use`)
    this.name = 'EmailAlreadyInUse'
  }
}
