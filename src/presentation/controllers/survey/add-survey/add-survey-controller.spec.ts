import { Controller } from '../../../protocols'
import { AddSurveyModel } from '../../../../domain/usecases/survey/survey-usecase'
import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'
import { AddSurveyController } from './add-survey-controller'
import { serverError } from '../../../helpers'
import { Validation } from '../../../../domain/usecases/validate/validation'

const makeValidation = (): Validation<Error> => {
  class ValidationStub implements Validation<Error> {
    validate (input: Record<string, any>): null | Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeDbAddSurvey = (): AddSurveyRepository => {
  class DbAddSurveyStub implements AddSurveyRepository {
    async add (survey: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DbAddSurveyStub()
}

interface SutTypes {
  sut: Controller
  dbAddSurveyStub: AddSurveyRepository
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
  test('should returns 204 on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({ body: makeFakeSurvey() })
    expect(result).toEqual({
      statusCode: 204
    })
  })
})
