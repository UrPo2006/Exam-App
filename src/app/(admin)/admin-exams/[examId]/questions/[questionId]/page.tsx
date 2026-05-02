"use client";

import { use, useEffect, useState } from "react";
import { Edit, ExternalLink, Ban, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeaderUpdater from "@/components/ui/headerupdat";
import Link from "next/link";
import DeleteQU from "@/app/(admin)/components/delete-qu/delete";
import QUImmutableButton from "@/app/(admin)/components/immutable-qu";


export default function QuestionDetailsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);

  const [questionData, setQuestionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/questions/${examId}`);
        const data = await response.json();

        if (data?.status && data.payload?.questions) {
          const targetQuestion =
            data.payload.questions.find((q: any) => q.id === examId) ||
            data.payload.questions[0];

          setQuestionData(targetQuestion);
        }
      } catch (err) {
        console.error("Failed to load question:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestion();
  }, [examId]);

  const questionText =
    questionData?.text || (isLoading ? "Loading..." : "Question Not Found");
  const examTitle = questionData?.exam?.title || "Final Exam";

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-6">
      <HeaderUpdater examName={examTitle} title={questionText} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-slate-400 flex-wrap">
        <span className="hover:text-slate-600 cursor-pointer">Exams</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-slate-600 cursor-pointer truncate max-w-[120px]">
          {examTitle}
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-slate-600 cursor-pointer">Questions</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-medium truncate max-w-[200px]">
          {questionText}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isLoading ? (
              <span className="inline-block w-72 h-6 bg-slate-200 animate-pulse rounded" />
            ) : (
              questionText
            )}
          </h1>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <span>Exam:</span>
            <span className="text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
              {isLoading ? (
                <span className="inline-block w-40 h-4 bg-slate-200 animate-pulse rounded" />
              ) : (
                <>
                  {examTitle} <ExternalLink className="w-3 h-3" />
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/*  QUImmutableButton */}
         <QUImmutableButton QuestionId={questionData?.id} />
          <Link href={`/admin-exams/${examId}/questions/${questionData?.id}/edit-qu`}>  
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </Link>
       
          <DeleteQU QuestionId={questionData?.id} variant="ghost"  className="bg-red-500 hover:bg-red-600 gap-2 text-white"/>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-8 space-y-6">
          {/* Headline */}
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-slate-400">Headline</h3>
            {isLoading ? (
              <div className="h-5 bg-slate-200 animate-pulse rounded w-2/3" />
            ) : (
              <p className="text-slate-800 font-medium">{questionText}</p>
            )}
          </div>

          {/* Exam */}
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-slate-400">Exam</h3>
            {isLoading ? (
              <div className="h-5 bg-slate-200 animate-pulse rounded w-48" />
            ) : (
              <span className="text-blue-600 flex items-center gap-1 text-sm cursor-pointer hover:underline w-fit">
                {examTitle} <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Answers */}
          <div className="space-y-1">
            <h3 className="text-sm font-mono text-slate-400">Answers</h3>
            {isLoading ? (
              <div className="h-5 bg-slate-200 animate-pulse rounded w-8" />
            ) : (
              <p className="text-slate-800 font-medium">
                {questionData?.answers?.length ?? 0}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
