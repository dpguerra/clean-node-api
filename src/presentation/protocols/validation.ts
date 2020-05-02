export interface Validation<R> {
  validate (input: {}): null | R
}
