export interface Validation<R> {
  validate (input: Record<string, any>): null | R
}
