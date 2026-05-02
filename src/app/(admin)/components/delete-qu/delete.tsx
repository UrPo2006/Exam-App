"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Question } from './../../../../interfaces/question';
interface DeleteQProps {
   QuestionId: string;
  onSuccess?: () => void;
  redirectTo?: string;
  
  className?: string; 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showIcon?: boolean;
  label?: string;
}

export default function DeleteQU({
  QuestionId,
 
  onSuccess,
  redirectTo = `/admin-exams`,
  className = "",
  variant = "destructive", 
  
  label,
}: DeleteQProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const token = session?.token;
const queryClient = useQueryClient();
  async function handleDelete() {

 
    try {
      setIsDeleting(true);
      const res = await fetch(`https://exam-app.elevate-bootcamp.cloud/api/questions/${QuestionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete exam");

      onSuccess?.();
      if (redirectTo) {
        router.push(redirectTo);

      }
    } catch (error) {
      console.error("Delete Exam Error:", error);
  
    } finally {
      setIsDeleting(false);
    }
  }


  return (
    <Button
      variant={variant}
      className={className}
      disabled={isDeleting}
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
    >
      <Trash2 className="w-2 h-2"  />
      {isDeleting ? "Deleting..." : (label || "Delete")}
    </Button>
  );
}