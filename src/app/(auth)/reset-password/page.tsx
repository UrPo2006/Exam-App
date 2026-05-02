"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),

  confirmPassword: z.string().min(8, "Please confirm your password"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

async function onSubmit(values: FormValues) {
  if (!token) {
    toast.error("");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(
      "https://exam-app.elevate-bootcamp.cloud/api/auth/reset-password",
      {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token, 
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

   
    router.push("/login");
  } catch (err) {
     if(err instanceof Error)
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
 <div className="relative w-125 h-100 mx-auto mt-50 overflow-hidden bg-white ">
      <div
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col  w-full h-full text-gray-800 p-6 gap-6"
      >
        <h2 className="text-3xl font-bold ">Create a New Password</h2>
        <p className="text-gray-400  text-sm">
        Create a new strong password for your account.
        </p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
            
              


              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="w-full h-11 border" // عدلت العرض لـ full
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm a New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showRePassword ? "text" : "password"}
                          placeholder="Confirm password"
                          className="w-full h-11 border" // عدلت العرض لـ full
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showRePassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white  mt-4"
              >
                {loading ? <Loader className="animate-spin" /> : "Reset Password"}
              </Button>

            <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/send-verification"
              className="text-blue-600 hover:underline"
            >
              Create yours
            </Link>
          </div>
            </form>
         
          </Form>
        </div> 
        </div>
      
   
  
);}
