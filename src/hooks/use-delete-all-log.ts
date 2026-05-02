import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function useDeleteAllLog() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const role = session?.user?.role;

  return useMutation({
    mutationFn: async () => {
   
      if (role !== "SUPER_ADMIN") {
        console.log("Access denied: Only SUPER_ADMIN can delete audit logs");
        throw new Error("FORBIDDEN");
      }

      const res = await axios.delete(
        "https://exam-app.elevate-bootcamp.cloud/api/admin/audit-logs"
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}