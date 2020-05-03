import { Validation } from '../../protocols/validation'
import { ComposedValidation } from './composedValidation'

interface SutTypes {
  sut: Validation<Error>
  validationStubs: Array<Validation<Error>>
}

const makeInput = (): {field: string} => ({
  field: 'any_value'
})

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation<Error> {
    validate (input: Record<string, any>): null | Error {
      return null
    }
  }
  const validationStubs = [
    new ValidationStub(),
    new ValidationStub()
  ]
  return {
    sut: new ComposedValidation(validationStubs),
    validationStubs
  }
}
describe('Composed Validation Helper', () => {
  test('should calls individuals validations with corrects values', () => {
    const { sut, validationStubs } = makeSut()
    const validateSpies = validationStubs.map(validationStub => jest.spyOn(validationStub, 'validate'))
    const input = makeInput()
    sut.validate(input)
    validateSpies.forEach(validateSpy => expect(validateSpy).toHaveBeenCalledWith(input))
  })
})
