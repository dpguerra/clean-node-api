import { Controller } from '../../../protocols'
import { AddSurveyModel } from '../../../../domain/usecases/survey/survey-usecase'
import { AddSurveyRepository } from '../../../../data/protocols/db/add-survey-repository'
import { AddSurveyController } from './add-survey-controller'
import { serverError } from '../../../helpers'

interface SutTypes {
  sut: Controller
  dbAddSurveyStub: AddSurveyRepository
}

const makeDbAddSurvey = (): AddSurveyRepository => {
  class DbAddSurveyStub implements AddSurveyRepository {
    async add (survey: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DbAddSurveyStub()
}

const makeSut = (): SutTypes => {
  const dbAddSurveyStub = makeDbAddSurvey()
  return {
    sut: new AddSurveyController(dbAddSurveyStub),
    dbAddSurveyStub
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
})
