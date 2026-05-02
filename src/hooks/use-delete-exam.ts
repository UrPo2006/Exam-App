import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/admin/exams/${id}`);
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}