"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";
import { toast, Toaster } from "sonner";

export default function ExamPage({
  params,
}: {
  params: Promise<{ diplomasId: string; examId: string }>;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [examName, setExamName] = useState<string>("");
  const [diplomaName, setDiplomaName] = useState<string>("");
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: string;
  }>({});

  const searchParams = useSearchParams();

  const examNameParam = searchParams.get("examName");
  const diplomaNameParam = searchParams.get("diplomaName");

  // 1. Fetch questions
  useEffect(() => {
    async function getQuestions() {
      try {
        const { examId } = await params;
        // console.log("Fetching questions for examId:", examId);
        const response = await fetch(`/api/questions/${examId}`);
        const data = await response.json();
        console.log("Fetched questions data:", data);
        if (data?.payload?.questions) {
          setQuestions(data.payload.questions);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    }
    getQuestions();
  }, [params]);
  // Header updater
  useEffect(() => {
    async function handleHeader() {
      const { examId, diplomasId } = await params;

      if (examNameParam && diplomaNameParam) {
        setExamName(examNameParam);
        setDiplomaName(diplomaNameParam);
      } else {
        try {
          const res = await fetch(`/api/exams/${examId}`);
          const data = await res.json();
          console.log("roma", data);

          setExamName(data?.title || "Exam");
          setDiplomaName(data?.diploma?.title || "Diploma");
        } catch (err) {
          console.error("Failed to fetch exam info", err);
          setExamName("Exam");
          setDiplomaName("Diploma");
        }
      }
    }

    handleHeader();
  }, [params, examNameParam, diplomaNameParam]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  const router = useRouter();
  //  حفظ الاجابات في قاعدة البيانات
  async function handleSubmit() {
    const { examId } = await params;

    // check unanswered
    const unansweredQuestionIndex = questions.findIndex(
      (q) => !selectedAnswers[q.id],
    );

    if (unansweredQuestionIndex !== -1) {
      setCurrentIndex(unansweredQuestionIndex);
      return;
    }

    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      }),
    );

    const body = {
      examId,
      answers: formattedAnswers,
      startedAt: new Date().toISOString(),
    };

    console.log("Submitting:", body);

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (data?.status === false) {
      console.error("Failed to submit answers:", data.message);

      return;
    }
    console.log("Submission ID:", data.payload.submission.id);
    sessionStorage.setItem("results", JSON.stringify(data.payload));
    if (res.ok) {
      router.push(
        `/results?submissionId=${data.payload.submission.id}&examName=${examName}&diplomaName=${diplomaName}`,
      );
    } else {
      console.log(data.message);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 p-6 bg-white mt-5">
        {/* Header Section */}
        <HeaderUpdater diplomaName={diplomaName} examName={examName} />
        <div className="flex justify-around">
          <div>
            <div className="flex w-260 justify-between mb-1 font-mono">
              <h1>
                {diplomaName} <span className="text-gray-400 pr-2">-</span>
                {examName}
              </h1>
              <p>
                Question{" "}
                <span className="text-blue-600">{currentIndex + 1}</span> of{" "}
                {questions.length}
              </p>
            </div>
            <div className="w-260 h-4 bg-blue-50 border border-blue-600">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="border-l-1 border-gray-200 w-20 flex items-center justify-end ml-4">
            {/* Timer */}
            <CircularProgress
              value={((currentIndex + 1) / questions.length) * 100}
              durationInSeconds={300}
              redirectTo="/results"
            />
          </div>
        </div>

        {/* Question Card */}

        <Card className="w-290">
          <CardHeader className="h-13">
            <CardTitle className="text-blue-600 text-xl font-mono">
              {currentQuestion?.text}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <RadioGroup
              className="w-full"
              value={selectedAnswers[currentQuestion?.id] || ""}
              onValueChange={(value) => {
                setSelectedAnswers((prev) => ({
                  ...prev,
                  [currentQuestion.id]: value,
                }));
              }}
            >
              {currentQuestion?.answers.map((answer) => (
                <FieldLabel
                  key={answer.id}
                  htmlFor={answer.id}
                  className="bg-gray-50 mb-2 block border  hover:border-blue-300 font-mono"
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <FieldContent className="h-7">
                      <FieldTitle>{answer.text}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </CardContent>
          {/* FOOTERRRR */}
          <CardFooter className="flex gap-4 justify-around font-mono">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="w-138 h-11 text-gray-400 bg-gray-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 rounded-none"
            >
              <ChevronLeft className="mr-2" /> Previous
            </Button>

            {currentIndex < questions.length - 1 ? (
              // NEXT BUTTON IN ALL QUESTIONS
              <Button
                onClick={handleNext}
                variant="outline"
                className="w-138 h-11 text-gray-400 bg-gray-200 hover:bg-blue-600 hover:text-white rounded-none"
              >
                Next <ChevronRight className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="outline"
                className="w-138 h-11 bg-blue-600 text-white hover:bg-blue-700 rounded-none"
              >
                Submit Exam <ChevronRight className="ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
