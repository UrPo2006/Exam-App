import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OTPSectionProps {
  onResend: () => Promise<boolean>;
  onVerify: () => Promise<void>;
  isLoading: boolean;
}

export default function OTPSection({ onResend, onVerify, isLoading }: OTPSectionProps) {
  const [seconds, setSeconds] = useState(60); 

 
  const handleResendClick = async () => {
    const success = await onResend();
    if (success) {
      setSeconds(60); 
    }
  };

   useEffect(() => {
    let timer: NodeJS.Timeout;
    if (seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
  
    }
    return () => clearTimeout(timer);
  }, [seconds]);


  return (
    <div className="flex flex-col items-center space-y-6 w-full">
   
      <p className="text-gray-500 text-sm  mb-6">
        
          <>You can request another code in:{seconds > 0 ? ( <span className="font-bold text-black ml-1">{seconds}s</span>
        ) : (
          <button onClick={handleResendClick} className="text-blue-600  font-medium pl-3 cursor-pointer ">Resending code</button>
        )}</>
      </p>

    
      <Button
        onClick={onVerify}
        disabled={isLoading}
        className="w-full h-12 bg-blue-50 hover:bg-blue-200 text-black font-bold border-2 border-blue-600"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Verify code"}
      </Button>
    </div>
  );
}