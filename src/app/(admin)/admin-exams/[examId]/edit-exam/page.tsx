"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useGetDiplomasList from "@/hooks/use-get-diplomas-list";
import HeaderUpdater from "@/components/ui/headerupdat";
import ImageExam from "@/app/(admin)/components/image-exam";
import QuestionsManager from "@/app/(admin)/components/questions-manager";


// ── Validation ────────────────────────────────────────────
const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  diplomaId: z.string().min(1, "Please select a diploma"),
  image: z.string().min(1, "Image is required"),
  duration: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Duration must be at least 1 min")
  ),
});

export default function EditExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.token;

  const { data: diplomasList = [] } = useGetDiplomasList();

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [examTitle, setExamTitle] = useState("");

  // ── Questions State ───────────────────────────────────────
  // الأسئلة الموجودة من الـ API (عندها id حقيقي)
  const [existingQuestions, setExistingQuestions] = useState<Question[]>([]);
  // كل الأسئلة (موجودة + جديدة) اللي بتتعرض في الـ QuestionsManager
  const [questions, setQuestions] = useState<Question[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      diplomaId: "",
      image: "",
      duration: 20,
    },
  });

  // ── جلب بيانات الـ Exam + الأسئلة ────────────────────────
  useEffect(() => {
    if (!token) return;

    async function fetchExam() {
      try {
        setIsFetching(true);

        // جلب بيانات الـ Exam
        const examRes = await fetch(
          `https://exam-app.elevate-bootcamp.cloud/api/exams/${examId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const examData = await examRes.json();
        const exam = examData?.payload?.exam ?? examData?.payload;

        if (exam) {
          setExamTitle(exam.title || "");
          form.reset({
            title: exam.title || "",
            description: exam.description || "",
            diplomaId: exam.diplomaId || exam.diploma?.id || "",
            image: exam.image || "",
            duration: exam.duration || 20,
          });

          if (exam.image) {
            setPreview(exam.image);
            setUploadedImageUrl(exam.image);
          }
        }

        // جلب الأسئلة الموجودة
        const questionsRes = await fetch(
          `https://exam-app.elevate-bootcamp.cloud/api/questions/exam/${examId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const questionsData = await questionsRes.json();
        const fetchedQuestions: Question[] =
          questionsData?.payload?.questions?.map((q: any) => ({
            id: q.id,
            text: q.text,
          })) || [];

        setExistingQuestions(fetchedQuestions);
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Failed to fetch exam:", err);
      } finally {
        setIsFetching(false);
      }
    }

    fetchExam();
  }, [examId, token, form]);

  // ── Submit ────────────────────────────────────────────────
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      // 1. تحديث بيانات الـ Exam
      const examRes = await fetch(
        `https://exam-app.elevate-bootcamp.cloud/api/exams/${examId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            diplomaId: values.diplomaId,
            duration: values.duration,
            image: uploadedImageUrl,
          }),
        }
      );

      if (!examRes.ok) {
        const examErr = await examRes.json();
        const errMsg =
          examErr?.errors?.map((e: any) => e.message).join(", ") ||
          examErr?.message ||
          "Failed to update exam";
        throw new Error(errMsg);
      }

      const existingIds = new Set(existingQuestions.map((q) => q.id));
      const currentIds = new Set(questions.map((q) => q.id));

      const deletedQuestions = existingQuestions.filter(
        (q) => !currentIds.has(q.id)
      );

      for (const q of deletedQuestions) {
        await fetch(
          `https://exam-app.elevate-bootcamp.cloud/api/questions/${q.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // 3. إضافة الأسئلة الجديدة فقط (اللي مش موجودة في الـ existingIds)
      const newQuestions = questions.filter((q) => !existingIds.has(q.id));

      for (const q of newQuestions) {
        await fetch(
          "https://exam-app.elevate-bootcamp.cloud/api/questions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              text: q.text,
              examId,
              answers: [
                { text: "Option 1", isCorrect: true },
                { text: "Option 2", isCorrect: false },
              ],
            }),
          }
        );
      }

      router.push(`/admin-exams/${examId}`);
    } catch (error) {
      console.error("Edit Exam Error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ── Loading Skeleton ──────────────────────────────────────
  if (isFetching) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen space-y-4">
        <div className="flex justify-end gap-2">
          <div className="h-10 w-24 bg-slate-200 animate-pulse rounded" />
          <div className="h-10 w-24 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-12 bg-blue-600" />
          <div className="p-6 grid grid-cols-2 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-11 bg-slate-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-10 bg-blue-600" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 animate-pulse m-2 rounded" />
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      <HeaderUpdater examName={examTitle} title="Edit" />

      {/* TOP BUTTONS */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="bg-gray-200"
        >
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
          onClick={form.handleSubmit(onSubmit)}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Exam"}
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">

          {/* Exam Information */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-blue-600 py-3 px-6 h-10">
              <CardTitle className="text-white text-base font-mono">
                Exam Information
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-mono font-medium">Title</FormLabel>
                      <FormControl>
                        <Input className="bg-white border-slate-200 h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Diploma */}
                <FormField
                  control={form.control}
                  name="diplomaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-mono font-medium">Diploma</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                            <SelectValue placeholder="Select diploma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {diplomasList.map((d: any) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image */}
                <div className="space-y-2">
                  <ImageExam
                    onUploadSuccess={(url) => {
                      setUploadedImageUrl(url);
                      form.setValue("image", url, { shouldValidate: true });
                    }}
                    preview={preview}
                    setPreview={setPreview}
                    error={form.formState.errors.image?.message as string}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-mono font-medium">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-white border-slate-200 h-25 resize-none"
                          placeholder="Comprehensive exam covering..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-mono font-medium">Duration (min)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-white border-slate-200 h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </CardContent>
          </Card>

          {/* Questions Manager */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
              <QuestionsManager
                questions={questions}
                setQuestions={setQuestions}
              />
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
}