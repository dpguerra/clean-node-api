import { MissingParamValidation } from './missingParamValidation'

describe('Missing Params Validation Helper', () => {
  test('should return an error if required value is not provided', () => {
    const sut = new MissingParamValidation(['required_field'])
    const result = sut.validate({
      any_field: 'any_value'
    })
    expect(result).toEqual(new Error('required_field'))
  })
  test('should return an error if required value is provided with empty value', () => {
    const sut = new MissingParamValidation(['required_field'])
    const result = sut.validate({
      any_field: 'any_value',
      required_field: ''
    })
    expect(result).toEqual(new Error('required_field'))
  })
})
