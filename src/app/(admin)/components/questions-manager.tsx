"use client";

import { useState } from "react";
import { Plus, Trash2, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface Question {
  id: string;
  text: string;
}

interface Props {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export default function QuestionsManager({ questions, setQuestions }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [questionText, setQuestionText] = useState("");

  const handleAdd = () => {
    if (questionText.trim().length < 5) return;

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: questionText,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionText("");
    setIsAdding(false);
  };

  return (
    <div className="    w-full">
      {/* Header Bar */}
      <div className="bg-blue-600 text-white px-4 h-10 py-2 flex justify-between items-center font-medium font-mono">
        <span>Exam Questions</span>
         <Button
        type="button" 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center text-sm hover:text-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Questions
        </Button>
      </div>

      {/* Table Header */}
      <div className="bg-[#e5e7eb] px-4 py-2 text-sm font-semibold text-gray-700 border-b">
        Title
      </div>

      {/* Questions List */}
      <div className="divide-y">
        {questions.length === 0 && !isAdding ? (
          <div className="p-8 text-center text-gray-400 bg-gray-50">
            No questions added yet.
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors group">
              <span className="text-sm text-gray-800 font-mono italic">
                {q.text}
              </span>
              <div className="flex gap-2">
                 <Button

        type="button" 
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setQuestions(prev => prev.filter(item => item.id !== q.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="bg-gray-100 p-1 rounded cursor-pointer">
                   <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Input Section (Matching the second image style) */}
      {isAdding && (
        <div className="bg-[#f0fdf9] p-3 border-t border-[#10b981]/30 flex gap-3 items-center">
            <Button
        type="button" 
            onClick={() => setIsAdding(false)}
            className="text-gray-400 hover:text-gray-600 border rounded-full p-1 bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question text..."
              className="border-blue-600 focus-visible:ring-blue-500 bg-white h-10"
              autoFocus
            />
          </div>

          <Button 
         
        type="button" 
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-4 text-white flex items-center gap-1 px-6"
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}