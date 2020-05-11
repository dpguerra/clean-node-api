export class InvalidUserOrPassword extends Error {
  constructor () {
    super('Invalid user or password')
    this.name = 'InvalidUserOrPassword'
  }
}
