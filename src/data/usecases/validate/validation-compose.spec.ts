import { Validation } from '../../../domain/usecases/validate/validation'
import { ValidationCompose } from './validation-compose'

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
    sut: new ValidationCompose(validationStubs),
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
  test('should returns an Error if any individual validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockImplementationOnce(() => new Error())
    const result = sut.validate(makeInput())
    expect(result).toEqual(new Error())
  })
  test('should returns an Error on first validation fail', () => {
    const { sut, validationStubs } = makeSut()
    validationStubs.forEach((validationStub, index) => jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => new Error(`#${index}`)))
    const result = sut.validate(makeInput())
    expect(result).toEqual(new Error('#0'))
  })
  test('should returns null if no individual validation fail', () => {
    const { sut } = makeSut()
    const result = sut.validate(makeInput())
    expect(result).toBeNull()
  })
})
