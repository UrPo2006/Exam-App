import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { CircleQuestionMark, MoveRight, Timer } from "lucide-react";

import { getDecodedToken } from "@/app/api/helpers/auth";
import Link from "next/link";
import { ExamsRoot } from "@/interfaces";
import HeaderUpdater from "@/components/ui/headerupdat";


const decoded = await getDecodedToken();

const userToken = decoded?.token;

export default async function SpecificDiplomaPage({params,}: {  params: Promise<{ diplomasId: string }>;}) {
  const { diplomasId } = await params;

  const response = await fetch(
    `https://exam-app.elevate-bootcamp.cloud/api/diplomas/` + diplomasId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

  const data: ExamsRoot = await response.json();
  const diploma = data?.payload?.diploma;
  const exams = diploma?.exams;

  console.log(data);
 



  return (
    <div className="p-6 bg-gray-50">
      {/* HeaderUpdater */}
      <HeaderUpdater title={diploma?.title || "Exams"} />
      {/* 2. Exams Grid */}
      
      
       <div className="grid grid-cols-1 md:grid-cols-1 gap-8 p-6 bg-white mt-5 font-mono">
        {exams.map((exam) => (
          <div key={exam.id} className="relative  h-34 flex     ">
            <Link
              href={`/diplomas/${diplomasId}/${exam.id}?examName=${exam.title}&diplomaName=${diploma.title}`}
            >
              <Card className="group relative w-250  bg-blue-50 overflow-hidden  hover:-translate-y-1 transition-all duration-300 border border-blue-200 hover:border-3 hover:border-dashed hover:shadow-md">
                <CardContent>
                  <div className="flex  gap-6 ">
                    {/* Image Container */}
                    <div className="relative  w-24 h-24   border border-blue-300 bg-blue-100  ">
                      <Image
                        className="object-contain  "
                        unoptimized
                        src={exam.image}
                        alt={exam.title}
                        fill
                      />
                    </div>

                    {/* Content */}
                    <div className="relative flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3 gap-2">
                        <h3 className="font-bold text-xl text-blue-600 tracking-tight leading-snug">
                          {exam.title}
                        </h3>

                        <div className="flex items-center gap-3 text-black text-sm whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <CircleQuestionMark className="w-4 h-4 text-black" />
                            <span>
                              {exam.description.length || 0} Questions
                            </span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1">
                            <Timer className="w-4 h-4 text-black" />
                            <span>{exam.duration} Minutes</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-1 pr-4 line-clamp-2">
                        {exam.description ||
                          "No description available for this exam."}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="flex items-center justify-center px-3 h-9 bg-blue-600 text-white font-mono rounded">
                    START
                    <MoveRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </Card>
            </Link>
          </div>
        ))}
        <footer className="text-center  text-gray-500 ">
          <p className=" tracking-widest">End of list</p>
        </footer>
      </div> 
    
      
    </div>
  );
}
