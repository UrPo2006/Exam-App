"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import HeaderUpdater from "@/components/ui/headerupdat";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcw, FolderSearch2 } from "lucide-react";
import DonutChart from "@/components/ui/Exam/donut-chart";
import { IAnalyticsItem } from "@/interfaces";

export const dynamic = "force-dynamic";

// ✅ wrapper
export default function ResultsPageWrapper(props: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsPage {...props} />
    </Suspense>
  );
}

// ❌ FIX: params مش Promise
function ResultsPage({
  params,
}: {
  params: { diplomasId: string; examId: string };
}) {
 
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examName, setExamName] = useState("");
  const [diplomaName, setDiplomaName] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const examNameParam = searchParams.get("examName") || "Exam";
  const diplomaNameParam = searchParams.get("diplomaName") || "Diploma";

  useEffect(() => {
    setExamName(examNameParam);
    setDiplomaName(diplomaNameParam);
  }, [examNameParam, diplomaNameParam]);

  useEffect(() => {

    const stored = sessionStorage.getItem("results");

    if (!stored) {
      setLoading(false);
      return;
    }

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

    setQuestions(mapped);
    setTotal(analytics.length);
    setCorrect(analytics.filter((i: any) => i.isCorrect).length);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">

      <HeaderUpdater
        diplomaName={diplomaName}
        examName={examName}
      />

      {/* header */}
      <div className="flex justify-around">
        <div>
          <h1>
            {diplomaName} - {examName}
          </h1>
          <p>
            Question <span>{total}</span> of {total}
          </p>
        </div>
      </div>

      <h2 className="text-blue-600 font-bold">Results</h2>

      <div className="flex gap-6">
        <div className="w-68 bg-blue-50">
          <DonutChart correct={correct} total={total} />
        </div>

        <div className="flex-1">
          {questions.map((item) => (
            <div key={item.id}>
              <p className="text-blue-600 font-bold">{item.text}</p>

              {item.answers.map((ans: any) => (
                <div key={ans.id}>
                  {ans.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.back()}>
          <RotateCcw /> Restart
        </Button>

        <Button onClick={() => router.push("/diplomas")}>
          <FolderSearch2 /> Explore
        </Button>
      </div>

    </div>
  );
}