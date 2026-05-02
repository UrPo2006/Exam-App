"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import HeaderUpdater from "@/components/ui/headerupdat";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcw, Compass, FolderSearch, FolderSearch2 } from "lucide-react";
import DonutChart from "@/components/ui/Exam/donut-chart";
import { IAnalyticsItem, ISubmissionAnalyticsRoot } from "@/interfaces";
import { toast } from "sonner";


interface QuestionResult {
  id: string;
  text: string;
  selectedAnswerId: string | null;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ diplomasId: string; examId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [examName, setExamName] = useState<string>("");
  const [diplomaName, setDiplomaName] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const examNameParam = searchParams.get("examName") || "Exam";
  const diplomaNameParam = searchParams.get("diplomaName") || "Diploma";

  // Header
  useEffect(() => {
    setExamName(examNameParam);
    setDiplomaName(diplomaNameParam);
  }, [examNameParam, diplomaNameParam]);

  // Fetch Submission Analytics
  useEffect(() => {
    const stored = sessionStorage.getItem("results");

    if (stored) {
      const data = JSON.parse(stored);

      const analytics = data.analytics;

      const mapped = analytics.map((item: IAnalyticsItem) => ({
        id: item.questionId,
        text: item.questionText,
        selectedAnswerId: item.selectedAnswer?.id ?? null,
        answers: [
          {
            id: item.correctAnswer.id,
            text: item.correctAnswer.text,
            isCorrect: true,
          },
          ...(!item.isCorrect && item.selectedAnswer
            ? [
                {
                  id: item.selectedAnswer.id,
                  text: item.selectedAnswer.text,
                  isCorrect: false,
                },
              ]
            : []),
        ],
      }));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestions(mapped);
      setTotal(analytics.length);
      setCorrect(analytics.filter((item) => item.isCorrect).length);
      setLoading(false);
    }
  }, []);
  if (loading)
    return (
      <>
       <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">
          <div className="animate-pulse mb-8">
  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div> <div className="h-2 bg-gray-200 rounded-full w-full"></div> </div>
  <div className="flex flex-col md:flex-row gap-6 animate-pulse">
  
  <div className="w-full md:w-1/3 border border-gray-100 p-6 rounded-lg flex flex-col items-center">
    <div className="w-32 h-32 bg-gray-200 rounded-full mb-6"></div> <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div> <div className="h-4 bg-gray-200 rounded w-1/2"></div>    </div>

  <div className="w-full md:w-2/3 space-y-6">
    <div className="border border-gray-100 p-4 rounded-lg">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div> <div className="space-y-3">
        <div className="h-10 bg-gray-100 rounded w-full border border-gray-200"></div> <div className="h-10 bg-gray-100 rounded w-full border border-gray-200"></div> </div>
    </div>
    
    <div className="border border-gray-100 p-4 rounded-lg">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-10 bg-gray-100 rounded w-full"></div>
    </div>
  </div>

</div>
<div className="flex gap-4 mt-10 animate-pulse">
  <div className="h-12 bg-gray-200 rounded w-1/2"></div> <div className="h-12 bg-blue-100 rounded w-1/2"></div> </div>
       </div>
    
      </>
    );

  return (
    <>
      <HeaderUpdater diplomaName={diplomaName} examName={examName} />
      <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">
        {/* Progress bar */}
        <div className="flex justify-around">
          <div>
            <div className="flex w-260 justify-between mb-1 font-mono">
              <h1>
                {diplomaName}
                <span className="text-gray-400 mx-2">-</span>
                {examName}
              </h1>
              <p>
                Question <span className="text-blue-600">{total}</span> of{" "}
                {total}
              </p>
            </div>
            <div className="w-260 h-4 bg-blue-50 border border-blue-600">
              <div className="h-full bg-blue-600 w-full transition-all" />
            </div>
          </div>
          <div className="w-20" />
        </div>

        {/* Results Label */}
        <h2 className="text-blue-600 font-mono text-2xl font-bold">Results:</h2>

        {/* Results Body */}
        <div className="flex gap-6 w-290">
          {/* Donut chart */}
          <div className="w-68 h-128 shrink-0 flex items-center justify-center pt-2 bg-blue-50 border border-blue-200">
            <DonutChart correct={correct} total={total} />
          </div>

          {/* Questions review list */}
          <div className="flex-1 border border-dashed border-blue-200 max-h-127 overflow-y-auto">
            {questions.map((item) => (
              <div
                key={item.id}
                className="p-4 font-mono border-b border-blue-100 last:border-b-0"
              >
                {/* Question */}
                <p className="text-blue-600 font-bold mb-3">{item.text}</p>

                <div className="flex flex-col gap-2">
                  {item.answers.map((ans) => {
                    const isSelected = ans.id === item.selectedAnswerId;

                    return (
                      <div
                        key={ans.id}
                        className={`flex items-center gap-3 px-4 py-2 border text-sm
              ${
                ans.isCorrect
                  ? "bg-green-50 border-green-300 text-green-700"
                  : isSelected
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-gray-50 border-gray-200"
              }`}
                      >
                        {/* دائرة */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${
                  ans.isCorrect
                    ? "border-green-500"
                    : isSelected
                      ? "border-red-500"
                      : "border-gray-300"
                }`}
                        >
                          {(ans.isCorrect || isSelected) && (
                            <div
                              className={`w-2 h-2 rounded-full
                    ${ans.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                            />
                          )}
                        </div>

                        {/* النص */}
                        <span>{ans.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 w-290 font-mono">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 h-12 bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>

          <Button
            onClick={() => router.push("/diplomas")}
            className="flex-1 h-12 bg-blue-600 text-white hover:bg-blue-700"
          >
            <FolderSearch2 className="w-4 h-4 mr-2" />
            Explore
          </Button>
        </div>
      </div>
    </>
  );
}
