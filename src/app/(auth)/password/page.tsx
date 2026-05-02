"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
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
import Link from "next/link";
import Stepper from "@/components/ui/stepper";

const schema = z
  .object({
    password: z.string().min(8, "Your Password is required."),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof schema>;

export default function PasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const userData = {
    firstName: searchParams.get("firstName"),
    lastName: searchParams.get("lastName"),
    username: searchParams.get("username"),
    phone: searchParams.get("phone"),
    email: searchParams.get("email"),
  };

  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    mode: "onChange",

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);

    if (!userData.email) {
      toast.error("Email is missing! Please start from the first step.");
      setLoading(false);
      return;
    }
    try {
      console.log({
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,

          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });
      const data = await res.json();

      console.log("Full API Response:", data);
      if (!res.ok) {
        toast.error(data.message || "Registration failed ❌");
        return;
      }

      toast.success("Account created successfully 🎉");
      router.push(`/login?${userData.username}`);
    } catch (error) {
      if (error instanceof Error) toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex ">
      <div className="w-full max-w-[450px] mx-auto mt-20 p-8 space-y-6 flex items-center justify-center  bg-white">
        <div className="w-full  space-y-6 py-8">
          <Stepper currentStep={4} />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="*********"
                          className="w-full h-11 border" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                       {/* ComfirmPassword */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showRePassword ? "text" : "password"}
                          placeholder="*********"
                          className="w-full h-11 border" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showRePassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeOff size={20} />
                          )}
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
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-none mt-4"
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "create Account"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-bold">
                  login
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
