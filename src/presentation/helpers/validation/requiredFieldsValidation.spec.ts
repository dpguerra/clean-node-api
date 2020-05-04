import { RequiredFieldsValidation } from './requiredFieldsValidation'
import { MissingParamError } from '../../errors'

describe('Missing Params Validation Helper', () => {
  test('should return an error if required value is not provided', () => {
    const sut = new RequiredFieldsValidation(['required_field'])
    const result = sut.validate({
      any_field: 'any_value'
    })
    expect(result).toEqual(new MissingParamError('required_field'))
  })
  test('should return an error if required value is provided with empty value', () => {
    const sut = new RequiredFieldsValidation(['required_field'])
    const result = sut.validate({
      any_field: 'any_value',
      required_field: ''
    })
    expect(result).toEqual(new MissingParamError('required_field'))
  })
  test('should return an error if required value is provided with null value', () => {
    const sut = new RequiredFieldsValidation(['required_field'])
    const result = sut.validate({
      any_field: 'any_value',
      required_field: null
    })
    expect(result).toEqual(new MissingParamError('required_field'))
  })
  test('should return an error for the first missing field', () => {
    const sut = new RequiredFieldsValidation(['required_field', 'other_required_field'])
    const result = sut.validate({
      any_field: 'any_value'
    })
    expect(result).toEqual(new MissingParamError('required_field'))
  })
  test('should return return null if all required fields are provided', () => {
    const sut = new RequiredFieldsValidation(['required_field', 'other_required_field'])
    const result = sut.validate({
      any_field: 'any_value',
      required_field: 'any_value',
      other_required_field: 'any_value'
    })
    expect(result).toBeNull()
  })
})
