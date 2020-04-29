export class ServerError extends Error {
  constructor (public stack: string | undefined) {
    super('Internal server error')
    this.name = 'ServerError'
  }
}
