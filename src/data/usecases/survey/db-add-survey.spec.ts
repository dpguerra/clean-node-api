import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DBAddSurvey } from './db-add-survey'

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (account: AddSurveyModel): Promise <void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: AddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  return {
    sut: new DBAddSurvey(addSurveyRepositoryStub),
    addSurveyRepositoryStub
  }
}

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    'any_answer'
  ]
})

describe('DBAddSurey Usecase tests', () => {
  test('should call AddSurveyRepository with correct value', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurvey())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })
  test('should throws if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeSurvey())
    await expect(promise).rejects.toThrow()
  })
  test('should returns void on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(makeFakeSurvey())
    expect(result).toBeFalsy()
  })
})
