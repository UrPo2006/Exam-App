"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader, XCircle } from "lucide-react";
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
import AccountSidebar from "../components/account-sidebar";
import toast from "react-hot-toast";
const schema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof schema>;

export default function AccountPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<PasswordValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });



//onSubmit
const onSubmit = async (values: PasswordValues) => {
  setLoading(true);
  setErrorMessage(null); 
  try {
    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (data.status) {
      toast.success("Your password has been updated.");
      form.reset();
    } else {
      setErrorMessage(data.message || "Something went wrong"); // ✅
    }
  } catch {
    setErrorMessage("Something went wrong");
  } finally {
    setLoading(false);
  }
};
const watchAllFields = form.watch();

useEffect(() => {
  if (errorMessage) {
    setErrorMessage(null);
  }
}, [watchAllFields.currentPassword, watchAllFields.newPassword, watchAllFields.confirmPassword]);
  const fields = [
    { name: "currentPassword" as const, label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(p => !p) },
    { name: "newPassword" as const, label: "New Password", show: showNew, toggle: () => setShowNew(p => !p) },
    { name: "confirmPassword" as const, label: "Confirm New Password", show: showConfirm, toggle: () => setShowConfirm(p => !p) },
  ];

  return (
     <div className="flex gap-10 max-w-7xl">
            {/* Sidebar */}
            <div className="min-w-80 h-178 bg-white p-6">
              <AccountSidebar />
            </div>
            
        <div className="min-w-190 h-178 bg-white p-6">
          <div className="flex-1">
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 ">
        
        {fields.map(({ name, label, show, toggle }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600 font-mono">{label}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
{errorMessage && (
  <div className="relative w-full border border-red-400  bg-red-50  py-3 mt-4">

    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-1">
      <XCircle className="text-red-500 fill-white" size={20} />
    </div>
    
    <div className="text-center text-red-500 text-sm font-mono font-mono">
     <p>Something went wrong</p>
    </div>
  </div>
)}


        <Button
          type="submit"
          disabled={loading || !form.formState.isValid}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-mono rounded-none mt-2"
        >
          {loading ? <Loader className="animate-spin" /> : "Update Password"}
        </Button>

      </form>
    </Form>
    </div>
          </div>
    
    </div>
  );
}