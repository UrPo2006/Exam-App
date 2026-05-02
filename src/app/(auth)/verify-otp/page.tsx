'use client'

import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "user@example.com";

  return (
    <div className="w-113 h-97 flex flex-col items-start mt-70 ml-33 bg-white font-sans ">
      
      <Link 
        href="/forgot-password" 
        className="p-2 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all mb-10"
      >
        <MoveLeft size={20} className="text-gray-600" />
      </Link>

      <div className="max-w-md space-y-6">
     
        <h1 className="text-[32px] font-bold text-gray-800">
          Password Reset Sent
        </h1>

      
        <div className="space-y-5 w-full max-w-2xl  tracking-wider">
          <p>
            We have sent a password reset link to: <br/>
            <span className="text-blue-500 font-medium">{email}</span>
          </p>

          <p>
            Please check your inbox and follow the 
            instructions to reset your password.
          </p>

          <p className="text-gray-400 text-sm">
            If you don’t see the email within a few minutes, 
            check your spam or junk folder.
          </p>
        </div>

       
        <div className="pt-4 tracking-widest ">
          <p className="text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Create yours
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}