export interface QuizRoot {
  status: boolean
  code: number
  payload: QuizPayload
}

export interface QuizPayload {
  exam: QuizExam
}

export interface QuizExam {
  id: string
  title: string
  description: string
  image: string
  duration: number
  diplomaId: string
  immutable: boolean
  createdAt: string
  updatedAt: string
  diploma: QuizDiploma
  _count: Count
}

export interface QuizDiploma {
  id: string
  title: string
  description: string
  image: string
}

export interface Count {
  questions: number
}