"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { IResultsDaum } from '@/interfaces/results'


export default function ResultsPage() {
  const { id } = useParams()
  const [submission, setSubmission] = useState<IResultsDaum | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchSubmission = async () => {
      try {
        const res = await fetch(`/api/submissions/${id}`)
        const data = await res.json()
        setSubmission(data.payload)
      } catch (error) {
        console.error('Error fetching submission:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmission()
  }, [id])

  if (loading) return <p className="text-center text-blue-400">Loading...</p>
  if (!submission) return <p className="text-center text-red-400">No data found</p>


  return (
   <>
   <div className="flex-1 border border-dashed border-blue-200 max-h-127 overflow-y-auto">
  {questions.map((q) => (
    <div key={q.id} className="p-4 font-mono  border-blue-100 last:border-b-0">
      {/* Question Text */}
      <p className="text-blue-600 font-bold mb-3">{q.text}</p>

      {/* Answers */}
      <div className="flex flex-col gap-2">
        {q.answers.map((answer) => {
          const isSelected = answer.id === q.selectedAnswerId;
          const isCorrect = answer.isCorrect;

          let bg = "bg-gray-50";
          let border = "border-gray-200";

          if (isCorrect) {
            bg = "bg-green-50";
            border = "border-green-300";
          } else if (isSelected && !isCorrect) {
            bg = "bg-red-50";
            border = "border-red-300";
          }

          return (
            <div
              key={answer.id}
              className={`flex items-center gap-3 px-4 py-2 border text-sm ${bg} ${border}`}
            >
              {/* Radio */}
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? isCorrect ? "border-green-500" : "border-red-500"
                    : isCorrect ? "border-green-500" : "border-gray-300"
                }`}
              >
                {(isSelected || isCorrect) && (
                  <div className={`w-2 h-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`} />
                )}
              </div>

              <span className={isCorrect ? "text-green-700" : isSelected ? "text-red-600" : "text-gray-600"}>
                {answer.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>
   
   
   </>
  )
}
