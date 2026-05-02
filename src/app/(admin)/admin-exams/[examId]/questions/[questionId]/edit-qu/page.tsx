"use client";

import React, { useState, useEffect } from "react";
import { Save, X, Plus, Trash2, Check, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeaderUpdater from "@/components/ui/headerupdat";
import useGetExams from "@/hooks/use-get-exams";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import useGetQuestionById from "@/hooks/use-get-question"; 
import useEditQuestion from "@/hooks/use-edit-question"; 
import Link from "next/link";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function EditQuestionPage() {
  const [headline, setHeadline] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [examId, setExamId] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");

  const params = useParams();
  const questionId = params.questionId as string;

  const { data: session } = useSession();
  const token = session?.token;
  const router = useRouter();

  
  const { data: examsData } = useGetExams({
    page: 1,
    search: "",
    sortBy: "",
    sortOrder: "asc",
    diplomaId: "",
    immutable: "",
  });
  const exams = examsData?.payload?.data || [];

  const { data: questionData } = useGetQuestionById(token, questionId);

  useEffect(() => {
    if (questionData?.payload?.question) {
      const q = questionData?.payload?.question;

      setHeadline(q.text);

      setExamId(q.examId);

      setAnswers(
        q.answers.map((a: any) => ({
          id: a.id,
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      );
    }
  }, [questionData]);
  const editQuestion = useEditQuestion(token);

  const addAnswer = () => {
    if (!newAnswerText.trim()) return;
    setAnswers([
      ...answers,
      {
        id: crypto.randomUUID(),
        text: newAnswerText,
        isCorrect: false,
      },
    ]);
    setNewAnswerText("");
  };

  const toggleCorrect = (id: string) => {
    setAnswers(
      answers.map((ans) => ({
        ...ans,
        isCorrect: ans.id === id,
      })),
    );
  };

  const deleteAnswer = (id: string) => {
    setAnswers(answers.filter((ans) => ans.id !== id));
  };

  const onSubmit = () => {
    if (!headline || !examId || answers.length === 0) return;
    if (!answers.some((a) => a.isCorrect)) return;

    editQuestion.mutate(
      {
        id: questionId,
        text: headline,
        answers: answers.map((a) => ({
          text: a.text,
          isCorrect: a.isCorrect,
        })),
      },
      {
        onSuccess: () => {
          router.push(`/admin-exams/${examId}`);
        },
      },
    );
  };

  return (
    <>
      <HeaderUpdater title="Edit Question" />
      <div className="min-h-screen bg-gray-50 p-6 font-mono">
        <div className="flex justify-between items-center mb-8 bg-white p-4 shadow-sm rounded-sm">
          <Link href={`/admin-exams/${examId}/bulk`}>
            <Button
              variant="outline"
              className="bg-gray-50 border-none text-xs h-9 gap-2"
            >
              <LayoutGrid className="w-4 h-4" /> Bulk Add Mode
            </Button>
          </Link>

          <Button
            disabled={editQuestion.isPending}
            onClick={onSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            {editQuestion.isPending ? "Saving..." : "Save Question"}
          </Button>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Question Information */}
          <div className="border overflow-hidden shadow-sm bg-white">
            <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold tracking-wider">
              Question Information
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Exam
                </label>
                <Select value={examId} onValueChange={setExamId}>
                  <SelectTrigger className="w-full border-gray-200 text-gray-400 italic">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-50"
                  >
                    {exams.map((d: any) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Question Headline
                </label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="border-gray-200 focus-visible:ring-emerald-500 h-12"
                />
              </div>
            </div>
          </div>

          {/* Question Answers */}
          <div className="border overflow-hidden shadow-sm bg-white">
            <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold tracking-wider">
              Question Answers
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] bg-gray-50 border-b">
              <div className="w-16"></div>
              <div className="py-2 px-4 text-xs font-bold font-mono text-gray-600">
                Body
              </div>
              <div className="w-48 flex justify-end p-1">
                <Button
                  size="sm"
                  className="bg-emerald-500 rounded-none hover:bg-emerald-600 font-mono h-9 gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Answer
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {answers.map((ans) => (
                <div
                  key={ans.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center"
                >
                  <div className="w-16 flex justify-center border-r h-full py-4 bg-red-50/30">
                    <button
                      onClick={() => deleteAnswer(ans.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-4 text-sm text-gray-700 italic">
                    {ans.text}
                  </div>
                  <div className="w-48 px-4 flex justify-end">
                    {ans.isCorrect ? (
                      <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                        <Check className="w-4 h-4" /> Correct Answer
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={() => toggleCorrect(ans.id)}
                        className="text-xs text-gray-500 hover:text-emerald-600 h-8 gap-1 bg-gray-100/50"
                      >
                        <Check className="w-3 h-3" /> Mark Correct
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Input Row */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center bg-emerald-100/50">
                <div className="w-16 flex justify-center border-r h-full py-4">
                  <button className="text-gray-400 border rounded-full p-1 border-gray-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="px-2">
                  <Input
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                    placeholder="Enter answer body"
                    className="border-emerald-300 focus-visible:ring-emerald-500 h-10 bg-white italic text-sm"
                  />
                </div>
                <div className="w-48 px-4 flex justify-end">
                  <Button
                    onClick={addAnswer}
                    className="bg-emerald-500 hover:bg-emerald-500 text-xs h-8 gap-1 px-6"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
