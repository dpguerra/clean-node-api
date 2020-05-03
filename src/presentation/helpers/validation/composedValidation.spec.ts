import { Validation } from '../../protocols/validation'
import { ComposedValidation } from './composedValidation'

interface SutTypes {
  sut: Validation<Error>
  validationStub: Validation<Error>
  anotherValidationStub: Validation<Error>
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
  const validationStub = new ValidationStub()
  const anotherValidationStub = new ValidationStub()
  return {
    sut: new ComposedValidation([validationStub]),
    validationStub,
    anotherValidationStub
  }
}
describe('Composed Validation Helper', () => {
  test('should call individual validation with corrects values', () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const input = makeInput()
    sut.validate(input)
    expect(validateSpy).toHaveBeenCalledWith(input)
  })
})
