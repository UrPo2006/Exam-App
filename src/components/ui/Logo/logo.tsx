"use client";

import Image from 'next/image'
import React from 'react'
import { useSession } from "next-auth/react";

import image1 from "../../../../public/imag/Vector.png"
import image2 from "../../../../public/imag/Elevate.png"
import image3 from "../../../../public/imag/finalimge.png"
import image4 from "../../../../public/imag/code.png"

export default function Logo() {

  const { data: session } = useSession();

  const role = session?.role; 

  
  if (role === "ADMIN") {
    return (
      <div className="flex flex-col gap-4 w-48 h-19 mt-10 ">
        <span>
          <Image src={image3} alt="Logo" width={192} height={37} />
        </span>
        <div className='flex gap-2'>
          <Image src={image4} alt="Logo" width={30} height={30} />
          <span className="text-white font-mono font-bold text-2xl w-29 h-6">
            Exam App
          </span>
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-4 w-48 h-19 mt-10 mb-15 ">
      <span>
        <Image src={image2} alt="Logo" width={192} height={37} />
      </span>
      <div className='flex gap-2'>
        <Image src={image1} alt="Logo" width={30} height={30} />
        <span className="text-blue-600 font-semibold text-lg w-23 h-6">
          Exam App
        </span>
      </div>
    </div>
  );
}