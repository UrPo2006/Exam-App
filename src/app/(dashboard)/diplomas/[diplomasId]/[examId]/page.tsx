"use client";

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircularProgress } from "@/components/ui/Exam/circular-progress";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "@/interfaces";

import HeaderUpdater from "@/components/ui/headerupdat";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

// ✅ Wrapper
export default function ExamPageWrapper(props: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamPage {...props} />
    </Suspense>
  );
}

// ✅ FIX: params مش Promise
function ExamPage({
  params,
}: {
  params: { diplomasId: string; examId: string };
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examName, setExamName] = useState("");
  const [diplomaName, setDiplomaName] = useState("");

  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: string;
  }>({});

  const searchParams = useSearchParams();
  const router = useRouter();

  const examNameParam = searchParams.get("examName");
  const diplomaNameParam = searchParams.get("diplomaName");

  // ✅ FIX useEffect async
  useEffect(() => {
    async function getQuestions() {
      try {
        const response = await fetch(`/api/questions/${params.examId}`);
        const data = await response.json();

        if (data?.payload?.questions) {
          setQuestions(data.payload.questions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getQuestions();
  }, [params.examId]);

  useEffect(() => {
    async function handleHeader() {
      if (examNameParam && diplomaNameParam) {
        setExamName(examNameParam);
        setDiplomaName(diplomaNameParam);
        return;
      }

      try {
        const res = await fetch(`/api/exams/${params.examId}`);
        const data = await res.json();

        setExamName(data?.title || "Exam");
        setDiplomaName(data?.diploma?.title || "Diploma");
      } catch (err) {
        console.error(err);
      }
    }

    handleHeader();
  }, [params.examId, examNameParam, diplomaNameParam]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  async function handleSubmit() {
    const examId = params.examId;

    const unanswered = questions.findIndex(
      (q) => !selectedAnswers[q.id]
    );

    if (unanswered !== -1) {
      setCurrentIndex(unanswered);
      return;
    }

    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      })
    );

    const body = {
      examId,
      answers: formattedAnswers,
      startedAt: new Date().toISOString(),
    };

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data?.status === false) {
      toast.error(data.message);
      return;
    }

    sessionStorage.setItem("results", JSON.stringify(data.payload));

    router.push(
      `/results?submissionId=${data.payload.submission.id}&examName=${examName}&diplomaName=${diplomaName}`
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">
      <HeaderUpdater diplomaName={diplomaName} examName={examName} />

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion?.text}</CardTitle>
        </CardHeader>

        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQuestion?.id] || ""}
            onValueChange={(value) => {
              setSelectedAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: value,
              }));
            }}
          >
            {currentQuestion?.answers.map((answer) => (
              <FieldLabel key={answer.id} htmlFor={answer.id}>
                <RadioGroupItem value={answer.id} id={answer.id} />
                <FieldContent>
                  <FieldTitle>{answer.text}</FieldTitle>
                </FieldContent>
              </FieldLabel>
            ))}
          </RadioGroup>
        </CardContent>

        <CardFooter>
          <Button onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft /> Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next <ChevronRight />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Submit Exam <ChevronRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}