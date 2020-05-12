export interface AddSurveyModel {
  question: string
  answers: string[]
}

export interface AddSurvey {
  add(account: AddSurveyModel): Promise<void>
}
