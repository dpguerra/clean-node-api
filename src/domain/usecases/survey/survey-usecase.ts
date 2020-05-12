export interface AddSurveyModel {
  question: string
  answers: string[]
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>
}
