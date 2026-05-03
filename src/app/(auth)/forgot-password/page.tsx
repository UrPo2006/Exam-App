"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export const dynamic = "force-dynamic";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormValues = z.infer<typeof formSchema>;


export default function ForgotPasswordWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPassword />
    </Suspense>
  );
}


function ForgotPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: email || "" },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      const res = await fetch(
        "https://exam-app.elevate-bootcamp.cloud/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset code");
      }

      toast.success("Reset code sent to your email 📧");
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pl-33 mx-auto mt-70 p-8 bg-white">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Forgot Password
        </h2>

        <p className="text-gray-400 text-sm">
          Don’t worry, we will help you recover your
          <br />
          account.
        </p>

        <Form {...form}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com"
                    {...field}
                    className="w-[452px] h-[46px] border mb-5"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="w-113 h-11 py-3 bg-blue-600 text-white"
          >
            {loading ? "Sending..." : "Next"}
          </Button>

          <p className="text-sm pl-33 text-gray-500">
            Don’t have an account?
            <a href="/register" className="text-blue-600 hover:underline ml-2">
              create yours
            </a>
          </p>
        </Form>
      </form>
    </div>
  );
}