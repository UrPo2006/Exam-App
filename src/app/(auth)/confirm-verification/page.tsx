"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Stepper from "@/components/ui/stepper";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import OTPSection from "@/components/ui/time";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email)  router.push(`/register?email=${email}`);
  }, [email, router]);

         {/*ConfirmVerification*/}

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    setIsError(false)
    try {
      const res = await fetch("/api/auth/confirm-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      if (!res.ok) throw new Error("Verification failed");
      toast.success("Verified successfully ");
     router.push(`/register?email=${email}`);
    } catch (err) {
      setIsError(true)
       if(err instanceof Error)
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

          {/*SendVerification*/}
  const handleResendEmail = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to resend code");
      console.log("New OTP sent! ");
      return true;
    } catch (err) {
       if(err instanceof Error)
      console.log(err.message);
      return false;
    }
  };

  return (
    <div className="w-113 h-63  mx-auto mt-70 p-8   text-left space-y-6 ">
      <Stepper currentStep={2} />
      <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
      <h2 className="text-2xl font-bold text-blue-600">Verify OTP</h2>

      <p className="text-gray-500">
        Please enter the 6-digits code we have sent to:
        <span className="font-medium text-black flex gap-2 items-center">
          {email}
          <Link href="/send-verification" className="text-blue-600 underline text-sm">Edit</Link>
        </span>
      </p>

 <div className="flex flex-col items-center space-y-4">
  <div className="flex justify-center">
    <InputOTP 
      maxLength={6} 
      value={otp} 
      onChange={(val) => {
        setOtp(val);
        setIsError(false);
      }}
    >
      <InputOTPGroup className="gap-2">
        {[...Array(6)].map((_, i) => (
          <InputOTPSlot 
            key={i} 
            index={i} 
            className={`w-12 h-12 transition-colors ${
              isError 
                ? "border-red-500 text-red-600 bg-red-50" 
                : "border-gray-200"
            }`} 
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>

 
  {isError && (
    <p className="text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
      The code you entered is incorrect. Please try again.
    </p>
  )}
</div>


      <OTPSection 
        onResend={handleResendEmail} 
        onVerify={handleVerify} 
        isLoading={loading} 
      />
    </div>
  );
}