export interface ExamsRoot {
  status: boolean
  code: number
  payload: ExamsPayload
}

export interface ExamsPayload {
  diploma: Diploma
}

export interface Diploma {
  id: string
  title: string
  description: string
  image: string
  immutable: boolean
  createdAt: string
  updatedAt: string
  exams: Exam[]
}

export interface Exam {
  id: string
  title: string
  description: string
  image: string
  duration: number
  createdAt: string
}