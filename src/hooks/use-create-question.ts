import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateQuestion(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(
        "https://exam-app.elevate-bootcamp.cloud/api/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      return data;
    },

    onSuccess: () => {
   
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
  });
}