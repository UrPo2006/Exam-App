export interface ISubmissionAnalyticsRoot {
  status: boolean
  code: number
  payload: ISubmissionAnalyticsPayload
}

export interface ISubmissionAnalyticsPayload {
  analytics: IAnalyticsItem[]
}

export interface IAnalyticsItem {
  questionId: string
  questionText: string
  isCorrect: boolean
  correctAnswer: IAnswer
  selectedAnswer: IAnswer
}

export interface IAnswer {
  id: string
  text: string
}