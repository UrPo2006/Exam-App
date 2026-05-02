"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
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
import { ChevronRight, Loader2 } from "lucide-react"; 



const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type RegisterValues = z.infer<typeof schema>;

export default function SendEmailPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 
  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

                  //  onSubmit
  const onSubmit = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email, 
        }),
      });

      if (!res.ok) throw new Error("Failed to send code");

      toast.success("OTP sent to your email! 📧");
      
      
      router.push(`/confirm-verification?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if(err instanceof Error)
      toast.error(err.message|| "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
 
    <div className="w-113 h-63  mx-auto mt-70 p-8 bg-white ">
  
      <h2 className="text-2xl font-inter font-bold mb-6 text-gray-900">Create Account</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-mono">Email</FormLabel>
                <FormControl>
         
                  <Input 
                    {...field} 
                    placeholder="user@example.com" 

                    className="h-12 border-gray-200 focus:border-blue-500 placeholder:text-gray-400 " 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-blue-100 border-blue-600 border-2 hover:bg-blue-600  text-black hover:text-white flex items-center justify-center gap-2 text-base font-mono"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Next <ChevronRight size={18}  />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4 font-mono">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-mono">
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}