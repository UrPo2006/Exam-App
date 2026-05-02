"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepperTow from "@/components/ui/stepper2";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeEmailDialog({
  open,
  onOpenChange,
}: ChangeEmailDialogProps) {
  const [step, setStep] = useState(1);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setNewEmail("");
      setOtp("");
      setIsError(false);
    }, 300);
  };

  // Start countdown when moving to step 2 
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleNext = async () => {
    if (step === 1) {
      const res = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (data.status) {
        setStep(2);
        startCountdown();
      } else {
        console.error(data.message);
      }
    } else {
      setLoading(true);
      try {
        const res = await fetch("/api/account/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: otp }),
        });
        const data = await res.json();
        if (data.status) {
          handleClose();
        } else {
          setIsError(true);
        }
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }
  };
//resend email
  const handleResend = async () => {
    if (!canResend) return;
    const res = await fetch("/api/account/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newEmail }),
    });
    if (res.ok) startCountdown();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-xl  p-0 rounded-none overflow-hidden gap-0">

        {/* Body */}
        <div className="p-10 flex flex-col gap-6">
          {/* Stepper */}
          <StepperTow currentStep={step} />

          {/* Title */}
          <DialogTitle className="text-3xl font-bold font-inter">
            Change Email
          </DialogTitle>

          {/* Step 1 */}
          {step === 1 ? (
            <div className="flex flex-col gap-6">
              <p className="text-blue-600 text-2xl font-bold font-inter">
                Enter your new email
              </p>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-mono">Email</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-11 rounded-none"
                />
              </div>
            </div>
          ) : (

            // Step 2

            <div className="flex flex-col gap-6">
              <p className="text-blue-600 text-2xl font-bold ">Verify OTP</p>

              <div className="flex flex-col gap-1 font-mono text-sm text-gray-500">
                <span>Please enter the 6-digits code we have sent to:</span>
                <span className="text-black flex items-center gap-2">
                  {newEmail}
                  <button
                    onClick={() => { setStep(1); setOtp(""); setIsError(false); }}
                    className="text-blue-600 underline text-sm"
                  >
                    Edit
                  </button>
                </span>
              </div>

              {/* OTP Input */}
              <div className="flex flex-col items-center gap-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => { setOtp(val); setIsError(false); }}
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={`w-12 h-12 rounded-none border transition-colors ${
                          isError
                            ? "border-red-500 text-red-600 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {isError && (
                  <p className="text-red-500 text-sm font-mono">
                    The code you entered is incorrect. Please try again.
                  </p>
                )}

                {/* Countdown / Resend */}
                <p className="text-sm text-gray-500 font-mono">
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      className="text-blue-600 underline"
                    >
                      Resend code
                    </button>
                  ) : (
                    <>You can request another code in: <span className="font-bold">{countdown}s</span></>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-mono text-base rounded-none"
            onClick={handleNext}
            disabled={step === 1 ? !newEmail : otp.length < 6 || loading}
          >
            {step === 1 ? (
              <>Next <span className="text-lg ml-1">›</span></>
            ) : loading ? (
              "Verifying..."
            ) : (
              "Verify Code"
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}