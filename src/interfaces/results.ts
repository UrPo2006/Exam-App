export interface IResultsRoot {
  status: boolean
  code: number
  payload: IResultsPayload
}

export interface IResultsPayload {
  data: IResultsDaum[]
  metadata: IResultsMetadata
}

export interface IResultsDaum {
  id: string
  userId: string
  examId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  startedAt: string
  submittedAt: string
  createdAt: string
  updatedAt: string
  exam: IResultsExam
}

export interface IResultsExam {
  id: string
  title: string
  duration: number
}

export interface IResultsMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
}
