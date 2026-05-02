import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function useToggleImmutable() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const role = session?.user?.role;

  return useMutation({
    mutationFn: async ({
      diplomaId,
      immutable,
    }: {
      diplomaId: string;
      immutable: boolean;
    }) => {
      
      if (role !== "SUPER_ADMIN") {
        console.log("Access denied: Only SUPER_ADMIN can change immutable state");
        throw new Error("FORBIDDEN");
      }

      const res = await axios.patch(
        `https://exam-app.elevate-bootcamp.cloud/api/admin/diplomas/${diplomaId}/immutable`,
        { immutable }
      );

      return res.data;
    },

    onSuccess: () => {
      // اعمل refresh للـ diplomas
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
    },
  });
}