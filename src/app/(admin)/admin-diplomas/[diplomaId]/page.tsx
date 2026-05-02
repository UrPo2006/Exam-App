import Image from "next/image";
import Link from "next/link";
import { Pencil, Ban, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderUpdater from "@/components/ui/headerupdat";
import { getDecodedToken } from "@/app/api/helpers/auth";
import DeleteDiploma from "../../components/delete-diploma/delete";
import ImmutableButton from "../../components/immutable-biploma";

export default async function DiplomaDetail({
  params,
}: {
  params: Promise<{ diplomaId: string }>; 
}) {
  const { diplomaId } = await params; 

  console.log("ID:", diplomaId); 

  const decoded = await getDecodedToken();
  const userToken = decoded?.token;

  const response = await fetch(
    `https://exam-app.elevate-bootcamp.cloud/api/diplomas/${diplomaId}`, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  const data = await response.json();
  console.log("API Response:", data);

  const diploma = data?.payload?.diploma ?? data?.payload;
  return (
    <>
       {/* Breadcrumb */}
       <HeaderUpdater title={diploma?.title} />

       
      {/* Title + Buttons */}
      <div className="flex items-center justify-between w-296 h-18  bg-gray-50 p-6 ">
        <h1 className="text-xl font-bold text-gray-800">{diploma?.title}</h1>

        <div className="flex gap-2 ">
        
          <ImmutableButton diplomaId={diplomaId} />

          <Link href={`/admin-diplomas/${diplomaId}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <PenLine className="w-4 h-4" />
              Edit
            </Button>
          </Link>


  <DeleteDiploma diplomaId={diplomaId}/>

         

        </div>
      </div>
    <div className="min-h-screen bg-gray-100 p-6 space-y-4">
    
     

    

      {/* Card */}
      <div className="bg-white rounded shadow-sm p-6 space-y-6">

        {/* Image */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-mono">Image</p>
          <div className="w-75 h-75 overflow-hidden rounded border border-gray-100">
            {diploma?.image ? (
              <Image
                src={diploma.image}
                alt={diploma.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-mono">Title</p>
          <p className="text-gray-800 font-mono">{diploma?.title}</p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-mono">Description</p>
          <p className="text-gray-600 font-mono leading-relaxed">
            {diploma?.description}
          </p>
        </div>

      </div>
    </div>
    </>
  
  );
}