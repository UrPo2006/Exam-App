"use client";

import React, { useState } from "react";
import {
  Save, X, Plus, Trash2, Check, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import HeaderUpdater from "@/components/ui/headerupdat";
import useGetExams from "@/hooks/use-get-exams";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useBulkCreateQuestions from "@/hooks/use-bulk-create-questions";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  headline: string;
  answers: Answer[];
}

const makeQuestion = (): Question => ({
  id: crypto.randomUUID(),
  headline: "",
  answers: [],
});

export default function BulkAddQuestionsPage() {
  const [examId, setExamId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([makeQuestion()]);
  const [activeQId, setActiveQId] = useState<string>("");
  const [newAnswerTexts, setNewAnswerTexts] = useState<Record<string, string>>({});

  const { data: session } = useSession();
  const token = session?.token;
  const router = useRouter();

  const { data: examsData } = useGetExams({
    page: 1, search: "", sortBy: "",
    sortOrder: "asc", diplomaId: "", immutable: "",
  });
  const exams = examsData?.payload?.data || [];

  const bulkCreate = useBulkCreateQuestions(token);

  
  const activeQuestion = questions.find(q => q.id === activeQId) ?? questions[0];

  // Question 
  const addQuestion = () => {
    const q = makeQuestion();
    setQuestions(prev => [...prev, q]);
    setActiveQId(q.id);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    const next = questions.filter(q => q.id !== id);
    setQuestions(next);
    if (activeQuestion?.id === id) setActiveQId(next[0].id);
  };

  const updateHeadline = (id: string, text: string) => {
    setQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, headline: text } : q)
    );
  };

  // Answer ops
  const addAnswer = (qId: string) => {
    const text = (newAnswerTexts[qId] ?? "").trim();
    if (!text) return;
    setQuestions(prev =>
      prev.map(q =>
        q.id === qId
          ? { ...q, answers: [...q.answers, { id: crypto.randomUUID(), text, isCorrect: false }] }
          : q
      )
    );
    setNewAnswerTexts(prev => ({ ...prev, [qId]: "" }));
  };

  const deleteAnswer = (qId: string, aId: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qId
          ? { ...q, answers: q.answers.filter(a => a.id !== aId) }
          : q
      )
    );
  };

  const toggleCorrect = (qId: string, aId: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qId
          ? { ...q, answers: q.answers.map(a => ({ ...a, isCorrect: a.id === aId })) }
          : q
      )
    );
  };

  // Submit
  const onSubmit = () => {
    if (!examId) return;

    for (const q of questions) {
      if (!q.headline.trim()) return;
      if (q.answers.length === 0) return;
      if (!q.answers.some(a => a.isCorrect)) return;
    }
    console.log( questions)

    bulkCreate.mutate(
      {
        examId,
        questions: questions.map(q => ({
          text: q.headline,
          answers: q.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
        })),
      },
      {
        onSuccess: () => router.push(`/admin-exams/${examId}`),
      }
    );
  };

  const idx = (q: Question) => questions.indexOf(q);

  return (
    <>
      <HeaderUpdater title="Bulk Add Questions" />
      <div className="min-h-screen bg-[#f8f9fa] p-6 font-mono">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 shadow-sm rounded-sm">
           <Button variant="outline" className="bg-blue-600 text-white border-none text-xs h-9 gap-2">
                     <LayoutGrid className="w-4 h-4" /> Bulk Add Mode
                   </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-[#e9ecef] border-none text-xs h-9 gap-2 px-6"
              onClick={() => router.back()}
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button
              disabled={bulkCreate.isPending}
              onClick={onSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-9 gap-2 px-6"
            >
              <Save className="w-4 h-4" />
              {bulkCreate.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">

          {/* Exam Info */}
          <div className="border shadow-sm bg-white">
            <div className="bg-[#2563eb] text-white px-4 py-2 text-sm font-bold tracking-wider">
              Exam Info
            </div>
            <div className="p-6">
              <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Exam</label>
              <Select value={examId} onValueChange={setExamId}>
                <SelectTrigger className="w-full border-gray-200 text-gray-400 italic">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="z-50">
                  {exams.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Questions */}
          <div className="border shadow-sm bg-white">
            <div className="bg-[#2563eb] text-white px-4 py-2 text-sm font-bold tracking-wider">
              Questions
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b overflow-x-auto bg-white">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className={`flex items-center gap-1 px-4 py-2 text-xs font-mono cursor-pointer border-r whitespace-nowrap transition-colors
                    ${activeQuestion?.id === q.id
                      ? "bg-white text-blue-600 border-b-2 border-b-blue-600 font-bold"
                      : "bg-[#f8f9fa] text-gray-500 hover:bg-white"
                    }`}
                  onClick={() => setActiveQId(q.id)}
                >
                  Q{i + 1}
                  {questions.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {/* + tab */}
              <button
                onClick={addQuestion}
                className="px-3 py-2 text-gray-400 hover:text-blue-600 hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Active Question */}
            {activeQuestion && (
              <div className="p-6 space-y-6">
                {/* Headline */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">Question Headline</label>
                  <Input
                    value={activeQuestion.headline}
                    onChange={(e) => updateHeadline(activeQuestion.id, e.target.value)}
                    className="border-gray-200 focus-visible:ring-emerald-500 h-12"
                    placeholder="Enter question text..."
                  />
                </div>

                {/* Answers Table */}
                <div className="border">
                  {/* Table Header */}
                  <div className="grid grid-cols-[auto_1fr_auto] bg-[#e9ecef] border-b">
                    <div className="w-16" />
                    <div className="py-2 px-4 text-xs font-bold font-mono text-gray-600">Body</div>
                    <div className="w-48 flex justify-end p-1">
                      <Button
                        size="sm"
                        className="bg-emerald-500 rounded-none hover:bg-emerald-600 font-mono h-9 gap-1"
                        onClick={() => addAnswer(activeQuestion.id)}
                      >
                        <Plus className="w-3 h-3" /> Add Answer
                      </Button>
                    </div>
                  </div>

                  <div className="divide-y">
                    {activeQuestion.answers.map((ans) => (
                      <div key={ans.id} className="grid grid-cols-[auto_1fr_auto] items-center">
                        <div className="w-16 flex justify-center border-r h-full py-4 bg-red-50/30">
                          <button
                            onClick={() => deleteAnswer(activeQuestion.id, ans.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="px-4 text-sm text-gray-700 italic">{ans.text}</div>
                        <div className="w-48 px-4 flex justify-end">
                          {ans.isCorrect ? (
                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                              <Check className="w-4 h-4" /> Correct Answer
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              onClick={() => toggleCorrect(activeQuestion.id, ans.id)}
                              className="text-xs text-gray-500 hover:text-emerald-600 h-8 gap-1 bg-gray-100/50"
                            >
                              <Check className="w-3 h-3" /> Mark Correct
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Input Row */}
                    <div className="grid grid-cols-[auto_1fr_auto] items-center bg-[#f0fff4]/50">
                      <div className="w-16 flex justify-center border-r h-full py-4">
                        <button className="text-gray-400 border rounded-full p-1 border-gray-300">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="px-2">
                        <Input
                          value={newAnswerTexts[activeQuestion.id] ?? ""}
                          onChange={(e) =>
                            setNewAnswerTexts(prev => ({ ...prev, [activeQuestion.id]: e.target.value }))
                          }
                          onKeyDown={(e) => { if (e.key === "Enter") addAnswer(activeQuestion.id); }}
                          placeholder="Enter answer body"
                          className="border-emerald-300 focus-visible:ring-emerald-500 h-10 bg-white italic text-sm"
                        />
                      </div>
                      <div className="w-48 px-4 flex justify-end">
                        <Button
                          onClick={() => addAnswer(activeQuestion.id)}
                          className="bg-[#00c9a7] hover:bg-[#00b894] text-xs h-8 gap-1 px-6"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}