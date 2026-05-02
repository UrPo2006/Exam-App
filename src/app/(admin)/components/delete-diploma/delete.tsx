'use client'

import { Trash2 } from 'lucide-react'
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useDeleteDiploma from "@/hooks/use-delete-diploma";
import { useRouter } from "next/navigation"; 

interface Props {
  diplomaId: string
}

export default function DeleteDiploma({ diplomaId }: Props) {
  const router = useRouter(); 
  const { mutate: deleteDiploma, isPending: isDeleting } = useDeleteDiploma();

  const handleDelete = (id: string) => {
    console.log("Deleting diploma with ID:", id);
    
    deleteDiploma(id, {
      onSuccess: () => {
        toast.success("Diploma deleted successfully");
      
        router.push("/admin"); 
      },
      onError: () => {
        toast.error("Failed to delete diploma");
      },
    });
  };

  return (
    <Button
      className="gap-2  bg-red-600 focus:text-red-600 text-white"
      onClick={() => handleDelete(String(diplomaId))} 
      disabled={isDeleting}
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}