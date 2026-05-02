"use client";

import { use, useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  ArrowUpDown,
  Ban,
  Pencil,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import HeaderUpdater from "@/components/ui/headerupdat";
import { QuestionPayload } from "@/interfaces";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteExam from "../../components/delete-exam/delete";
import DeleteQU from "../../components/delete-qu/delete";
import Image from "next/image";
import EImmutableButton from "../../components/immutable-exam";

export default function ExamDetailsPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);

  const [questions, setQuestions] = useState<QuestionPayload[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);
  const [isExamLoading, setIsExamLoading] = useState(true);

  useEffect(() => {
    async function fetchExamDetails() {
      try {
        setIsExamLoading(true);
        const response = await fetch(`/api/admin/exams/${examId}`);
        const data = await response.json();
        if (data?.status) {
          setExamData(data.payload.exam);
          console.log("Fetched exam details:", data.payload.exam);
        }
      } catch (err) {
        console.error("Failed to load exam details:", err);
      } 
    }
    fetchExamDetails();
  }, [examId]);

  useEffect(() => {
    async function getQuestions() {
      try {
        setIsQuestionsLoading(true);
        const response = await fetch(`/api/questions/${examId}`);
        const data = await response.json();
        if (data?.payload?.questions) {
          setQuestions(data.payload.questions);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setIsQuestionsLoading(false);
      }
    }
    getQuestions();
  }, [examId]);

  const currentExamTitle =
    examData?.title || (isExamLoading ? "Loading..." : "Exam Not Found");
  const currentDiplomaTitle =
    examData?.diploma?.title || (isExamLoading ? "Loading..." : "N/A");

  return (
    <>
      <HeaderUpdater diplomaName={currentExamTitle} />

   
      <div className="p-10 bg-slate-50 min-h-screen space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">
              {currentExamTitle}
            </h1>
            <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
              <span>Diploma:</span>
              <span className="text-slate-400 flex items-center gap-1 cursor-pointer border-b border-slate-300 hover:text-slate-600 hover:border-slate-500 transition-colors">
                {currentDiplomaTitle} <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* immutable */}

          <EImmutableButton examId={examId} />

           <Link href={`/admin-exams/${examId}/edit-exam`}>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 font-medium">
              <Edit className="w-4 h-4" /> Edit
            </Button>
            </Link>
          

            <DeleteExam 
              examId={examId} 
              variant="default" 
              className="gap-2 bg-red-600 hover:bg-red-700 px-6 font-medium text-white"
            />
          </div>
        </div>

        {/* Main Info Card */}
        <Card className="border-slate-200 shadow-sm ">
          <CardContent className="p-10 space-y-8">
            {/* Image Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 font-mono capitalize">Image</h3>
              <div className="w-[280px] h-[280px] rounded-md overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
{examData?.image ? (
              <Image
                src={examData.image}
                alt={examData.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
              </div>
            </div>

            {/* Content Fields */}
           
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">Title</h3>
                <p className="text-slate-900 font-semibold text-base">{currentExamTitle}</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">Duration</h3>
                <p className="text-slate-900 font-semibold">
                  {examData?.duration
                    ? `${examData.duration} Minutes`
                    : isExamLoading ? "..." : "N/A"}
                </p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <h3 className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">Description</h3>
                <p className="text-slate-600 max-w-4xl text-sm leading-relaxed">
                  {examData?.description || (isExamLoading ? "Loading..." : "No description provided.")}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">Diploma</h3>
                <div className="flex items-center gap-1  font-semibold text-sm cursor-pointer border-b border-blue-100 w-fit hover:border-blue-500 transition-all">
                  {currentDiplomaTitle} <ExternalLink className="w-3 h-3" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400 font-mono uppercase tracking-wider">No. of Questions</h3>
                <p className="text-slate-900 font-semibold">
                  {isQuestionsLoading ? "..." : questions.length}
                </p>
              </div>
           
          </CardContent>
        </Card>

        {/* Questions Table Section */}
        <div className="rounded-md overflow-hidden border border-slate-200 shadow-sm bg-white">
          <div className="bg-blue-600 py-4 px-6 flex justify-between items-center">
            <h2 className="text-white text-base font-semibold">Exam Questions</h2>
            <Link href="/add-qu">
             <Button
              variant="ghost"
              className="text-white hover:bg-white/20 h-9 text-sm gap-2 px-4 border border-white/30"
            >
              <Plus className="w-4 h-4" /> Add Questions
            </Button>
            </Link>
           
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-200">
                <TableHead className="px-6 h-12 text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Title
                </TableHead>
                <TableHead className="px-6 h-12 text-right">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-widest justify-end cursor-pointer hover:text-slate-900 transition-colors">
                    Sort <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isQuestionsLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="border-slate-50">
                    <TableCell className="py-4 px-6">
                      <div className="h-4 bg-slate-100 animate-pulse rounded w-1/3" />
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="h-8 w-8 bg-slate-100 animate-pulse rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-20 text-slate-400 text-sm italic">
                    No questions have been added to this exam yet.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q: any) => (
                  <TableRow
                    key={q.id}
                    className="hover:bg-slate-50/80 border-slate-100 transition-colors"
                  >
                    <TableCell className="py-4 px-6 text-slate-700 font-medium text-sm">
                      {q.text}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1 border-slate-200 shadow-lg">
                          <Link href={`/admin-exams/${examId}/questions/${q.id}`}>
                            <DropdownMenuItem className="gap-2 py-2.5 text-slate-600 cursor-pointer focus:bg-slate-100">
                              <Eye className="w-4 h-4 text-blue-500" />
                              View Details
                            </DropdownMenuItem>
                          </Link>
                            <Link href={`/admin-exams/${examId}/questions/${q.id}/edit-qu`}>  
                            <DropdownMenuItem className="gap-2 py-2.5 text-slate-600 cursor-pointer focus:bg-slate-100">
                            <Pencil className="w-4 h-4 text-emerald-500" />
                            Edit Question
                          </DropdownMenuItem>
                         </Link>
                          
                          <DropdownMenuItem>
                        <DeleteQU QuestionId={q.id}  variant="ghost" 
                           
                            className=" gap-2 text-red-600 focus:text-red-600"
                          />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}