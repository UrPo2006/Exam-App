"use client";
// import Image from "next/image";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { useForm } from "react-hook-form";
 import { z } from "zod";
 import { getSession, signIn, useSession } from "next-auth/react";
import {Button} from "@/components/ui/button"
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
 import { useRouter } from "next/navigation";
 import { useState } from "react";
 import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";




const formSchema = z.object({
  username: z.string().min(2, {
    message: "Your username is required.",
  }),
  password: z.string().min(4, {
    message: "Your Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
  setLoading(true);


  
  const res = await signIn("credentials", {
    username: values.username, 
    password: values.password,
    redirect: false,
  });
console.log(res?.url)
  setLoading(false);

  if (res?.ok) {
   
    const session = await getSession();
    console.log(session?.role);
   
  if (session?.role === "ADMIN") {
    setTimeout(() => router.push("/admin"), 800);
  } else {
    setTimeout(() => router.push("/"), 800);
  }
} else {

    toast.error(res?.error || "Invalid login details");
  }
}
return (


<>

 <div className=" flex items-center justify-center w-113 h-63  mx-auto mt-70 p-8 bg-white">

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-6 relative"
      >

        <h2 className="text-3xl font-bold text-gray-800 font-inter">
          Login
        </h2>

        <Form {...form}>
          
          {/* UserName */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-gray-800 text-sm font-mono">
                  Username
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="user123"
                    className="w-113 h-12 border font-mono placeholder:text-gray-400"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 text-sm font-mono">
                  Password
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="********"
                      className="w-113 h-12 border  pr-10  placeholder:text-gray-400 bg-white"
                       
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ?  <Eye size={20} /> : <EyeOff size={20} /> }
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot password */}
          <div className="text-right  absolute end-2  bottom-21 text-sm font-mono" >
            <Link
            href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="w-full h-12 mt-5 bg-blue-600 text-white font-mono"
          >
            {loading && <Loader className="animate-spin mr-2" />}
            Login
          </Button>

          <div className="text-center text-sm text-gray-600 font-mono">
            Don’t have an account?{" "}
            <Link
              href="/send-verification"
              className="text-blue-600 hover:underline"
            >
              Create yours
            </Link>
          </div>

        </Form>
      </form>
    </div>


</> 
);
}
