export interface Validation<R> {
  validate (input: Record<string, any>): null | R
}

export interface EmailValidation {
  isValid(email: string): boolean
}
