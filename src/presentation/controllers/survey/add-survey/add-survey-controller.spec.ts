import { AddSurvey, AddSurveyModel, Controller, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { serverError, noContent, badRequest } from '../../../helpers'

const makeValidation = (): Validation<Error> => {
  class ValidationStub implements Validation<Error> {
    validate (input: Record<string, any>): null | Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeDbAddSurvey = (): AddSurvey => {
  class DbAddSurveyStub implements AddSurvey {
    async add (survey: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DbAddSurveyStub()
}

interface SutTypes {
  sut: Controller
  dbAddSurveyStub: AddSurvey
  ValidationStub: Validation<Error>
}

const makeSut = (): SutTypes => {
  const dbAddSurveyStub = makeDbAddSurvey()
  const ValidationStub = makeValidation()
  return {
    sut: new AddSurveyController(dbAddSurveyStub, ValidationStub),
    dbAddSurveyStub,
    ValidationStub
  }
}

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    'any_answer'
  ]
})

describe('AddSurveyController tests', () => {
  test('should call DbAddSurey with corrects values', async () => {
    const { sut, dbAddSurveyStub } = makeSut()
    const addSpy = jest.spyOn(dbAddSurveyStub, 'add')
    await sut.handle({ body: makeFakeSurvey() })
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
  test('should returns 500 if DbAddSurvey throws', async () => {
    const { sut, dbAddSurveyStub } = makeSut()
    jest.spyOn(dbAddSurveyStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })
    const result = await sut.handle({ body: makeFakeSurvey() })
    expect(result).toEqual(serverError(new Error()))
  })
  test('should call Validation with corrects values', async () => {
    const { sut, ValidationStub } = makeSut()
    const validateSpy = jest.spyOn(ValidationStub, 'validate')
    await sut.handle({ body: makeFakeSurvey() })
    expect(validateSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
  test('should returns 500 if Validation throws', async () => {
    const { sut, ValidationStub } = makeSut()
    jest.spyOn(ValidationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await sut.handle({ body: makeFakeSurvey() })
    expect(result).toEqual(serverError(new Error()))
  })
  test('should returns 400 if Validation fails', async () => {
    const { sut, ValidationStub } = makeSut()
    jest.spyOn(ValidationStub, 'validate').mockImplementationOnce(() => {
      return new Error()
    })
    const result = await sut.handle({ body: makeFakeSurvey() })
    expect(result).toEqual(badRequest(new Error()))
  })
  test('should returns 204 on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({ body: makeFakeSurvey() })
    expect(result).toEqual(noContent())
  })
})
