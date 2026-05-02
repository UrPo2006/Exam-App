"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: number;
  strokeWidth?: number;
  durationInSeconds?: number;
  redirectTo?: string;
}

function CircularProgress({
  className,
  value = 0,
  size = 60,
  strokeWidth = 10,
  durationInSeconds = 300, 
  redirectTo = "/results",
  ...props
}: CircularProgressProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = React.useState(durationInSeconds);

  // Timer countdown
  React.useEffect(() => {
    if (timeLeft <= 0) {
      router.push(redirectTo);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, redirectTo]);

  // Format time as MM:SS
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  // Progress based on time remaining
  const timerValue = (timeLeft / durationInSeconds) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (timerValue / 100) * circumference;

  // Color turns red when less than 1 minute
  const isUrgent = timeLeft <= 60;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-blue-50 stroke-current"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={cn(
            "stroke-current transition-all duration-500 ease-in-out",
            isUrgent ? "text-red-500" : "text-blue-600"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Timer display */}
      <span className={cn(
        "absolute text-[10px] font-bold font-mono",
        isUrgent && "text-red-500"
      )}>
        {minutes}:{seconds}
      </span>
    </div>
  );
}

export { CircularProgress }