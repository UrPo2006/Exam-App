"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Save } from "lucide-react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderUpdater from "@/components/ui/headerupdat";
import ImageField from "@/app/(admin)/components/image-field";
import { useSession } from "next-auth/react";


const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Image is required"),
});

export default function EditDiplomaPage({
  params,
}: {
  params: Promise<{ diplomaId: string }>;
}) {
  const { diplomaId } = use(params);
  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.token;

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", image: "" },
  });

  useEffect(() => {

    if (!token) return;

    async function fetchDiploma() {
      try {
        setIsFetching(true);
        const res = await fetch(
          `https://exam-app.elevate-bootcamp.cloud/api/diplomas/${diplomaId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const diploma = data?.payload?.diploma ?? data?.payload;

        if (diploma) {
          form.reset({
            title: diploma.title || "",
            description: diploma.description || "",
            image: diploma.image || "",
          });
          if (diploma.image) {
            setPreview(diploma.image);
            setUploadedImageUrl(diploma.image);
          }
        }
      } catch (err) {
        console.error("Failed to fetch diploma:", err);
      } finally {
        setIsFetching(false);
      }
    }

    fetchDiploma();
  }, [diplomaId, token, form]); 

  //Submit 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(
        `https://exam-app.elevate-bootcamp.cloud/api/diplomas/${diplomaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            image: uploadedImageUrl,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      setStatus({ message: "Diploma updated successfully!", type: "success" });
       router.push(`/admin`);
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  //Loading Skeleton 
  if (isFetching) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen space-y-8">
        <div className="flex justify-end gap-2">
          <div className="h-10 w-24 bg-slate-200 animate-pulse rounded" />
          <div className="h-10 w-24 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-12 bg-blue-600" />
          <div className="p-6 space-y-6">
            <div className="h-48 w-48 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-10 bg-slate-200 animate-pulse rounded" />
            <div className="h-32 bg-slate-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  //Render 
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <HeaderUpdater title="Edit Diploma" />

      {/* TOP BUTTONS */}
      <div className="flex mb-12 relative">
        <div className="flex gap-2 absolute end-0">
          <Button
            variant="outline"
            className="bg-slate-200 w-24 h-10"
            onClick={() => router.back()}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>

          <Button
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 w-24 h-10"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* FORM */}
      <Form {...form}>
        <form className="space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-blue-600 py-3">
              <CardTitle className="text-white text-lg font-mono font-medium">
                Diploma Information
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">

              {/* IMAGE */}
              <ImageField
                onUploadSuccess={(url) => {
                  setUploadedImageUrl(url);
                  form.setValue("image", url, { shouldValidate: true });
                }}
                preview={preview}
                setPreview={setPreview}
                error={form.formState.errors.image?.message as string}
              />

              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold font-mono">Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold font-mono">Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-40 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATUS */}
              {status.message && (
                <div
                  className={`p-4 rounded-md flex items-center gap-2 text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      status.type === "success" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {status.message}
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}