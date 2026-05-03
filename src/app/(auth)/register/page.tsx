"use client";

import { Suspense, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
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

export const dynamic = "force-dynamic";

const schema = z.object({
  firstname: z.string().min(2, "Your first name is required"),
  lastname: z.string().min(2, "Your last name is required"),
  username: z.string().min(2, "Your username is required"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Invalid phone number format",
    }),
});

type RegisterValues = z.infer<typeof schema>;


// ✅ Wrapper
export default function RegisterFormWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}


// ✅ الكود الأصلي
function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      phone: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);

    try {
      const email = searchParams.get("email") || "";

      const params = new URLSearchParams();
      params.set("email", email);
      params.set("firstName", values.firstname);
      params.set("lastName", values.lastname);
      params.set("username", values.username);
      params.set("phone", values.phone);

      router.push(`/password?${params.toString()}`);
    } catch (err) {
      if (err instanceof Error) toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full max-w-[450px] mx-auto mt-20 p-8 space-y-6 flex items-center justify-center bg-white">
        <div className="w-full space-y-6 py-8">
          <Stepper currentStep={3} />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* First + Last Name */}
              <div className="flex gap-4">

                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ahmed" className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Abdullah" className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="user123" className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="EG"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-100 border-blue-600 border-2 hover:bg-blue-600 text-black flex items-center justify-center gap-2 text-base font-semibold"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Next"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/password" className="text-blue-600 font-bold">
                  Login
                </Link>
              </p>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}