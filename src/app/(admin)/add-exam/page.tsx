"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save } from "lucide-react";
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
import ImageExam from "../components/image-exam";
import { useSession } from "next-auth/react";
import QuestionsManager from "../components/questions-manager";

export interface Question {
  id: string;
  text: string;
}
const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  diplomaId: z.string(),
  image: z.string().min(1, "Image is required"),
 duration: z.coerce.number().min(1, "Duration must be at least 1 min"),
});

export default function AddExamPage() {
  const router = useRouter();
  const { data: diplomasList = [] } = useGetDiplomasList();
  const { data: session } = useSession();

  const token = session?.token;

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);


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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
     
      const res = await fetch("/api/admin/add-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          image: uploadedImageUrl,
        }),
      });
    
      const examData = await res.json();
    
      if (!res.ok) throw new Error(examData.message);

      const newExamId = examData.payload.exam.id;
      

      // questions
     for (const q of questions) {
  await fetch("https://exam-app.elevate-bootcamp.cloud/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: q.text,
      examId: newExamId,
      answers: [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
      ],
    }),
  });
}
      router.push("/admin-exams");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      <HeaderUpdater title="Create New Exam" />

      {/* Action Buttons */}
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
          {/* Exam Info */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-blue-600 py-3 px-6 h-10">
                <CardTitle className="text-white text-base  font-mono">Exam Information</CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
              
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-mono font-medium">Title</FormLabel>
                        <FormControl>
                          <Input className="bg-white border-slate-200 h-11" placeholder="Final Full Stack Development Certification Exam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diplomaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-mono font-medium">Diploma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                              <SelectValue placeholder="Select diploma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {diplomasList.map((d: any) => (
                              <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800  font-mono font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="bg-white border-slate-200 h-25  resize-none" 
                            placeholder="Comprehensive exam covering..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel className="text-gray-800 font-mono font-medium">Duration (min)</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-white border-slate-200 h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </CardContent>
            </Card>

          {/* Questions  */}
          <Card>

            <CardContent>
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