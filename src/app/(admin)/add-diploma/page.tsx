"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, Save, UploadCloud, FileImage } from "lucide-react";
import { useState } from "react";
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
import ImageField from "../components/image-field";


// VALIDATION

const formSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Image is required"), 
});

// وفي defaultValues:

export default function AddDiplomaForm() {
  const [loading, setLoading] = useState(false);
   const [preview, setPreview] = useState<string | null>(null);
 const [uploadedImageUrl, setUploadedImageUrl] = useState("");
const [status, setStatus] = useState({ message: "", type: "" });
  const router = useRouter(); 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
 defaultValues: {
  title: "",
  description: "",
  image: "",
},

  });

  

  // SUBMIT 
  
async function onSubmit(values: z.infer<typeof formSchema>) {
  setLoading(true);
  setStatus({ message: "", type: "" }); 
  try {
    const body = {
      title: values.title,
      description: values.description,
      image: uploadedImageUrl,
    };

    const res = await fetch("/api/admin/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
   
      throw new Error(data.message || "Something went wrong");
    }

    setStatus({ message: status?.message , type: "success" });
    form.reset(); 
   setPreview(null);
     router.push("/admin"); 
  } catch (error) {
     if(error instanceof Error)
    console.error("Submit Error:", error);
    setStatus({ 
      message: error instanceof Error ? error.message : "Something went wrong", 
      type: "error" 
    });
  } finally {
    setLoading(false);
  }
}
  const add = "Add New Diploma";

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <HeaderUpdater title={add || "Exams"} />

      {/* TOP BUTTONS */}
      <div className="flex mb-12 relative">
        <div className="flex gap-2 absolute end-0">
          <Button variant="outline" className="bg-slate-200 w-24 h-10">
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

              {/*IMAGE*/}
<ImageField
  onUploadSuccess={(url) => {
    setUploadedImageUrl(url);
    form.setValue("image", url, { shouldValidate: true }); 

  }}
     preview={preview} 
        setPreview={setPreview} 
  error={form.formState.errors.image?.message as string}
/>

              {/*TITLE*/}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold font-mono">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*DESCRIPTION*/}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold font-mono">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-40 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
{status.message && (
  <div
    className={`p-4 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
      status.type === "success"
        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
        : "bg-red-50 border border-red-200 text-red-700"
    }`}
  >
  
    <div className={`w-2 h-2 rounded-full ${status.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
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