import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useDeleteDiploma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/admin/${id}`);
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}