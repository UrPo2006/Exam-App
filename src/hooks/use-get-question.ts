import { useQuery } from "@tanstack/react-query";

export default function useGetQuestionById(token: string, id: string) {
  return useQuery({
    queryKey: ["question", id],
    enabled: !!token && !!id,

    queryFn: async () => {
      const res = await fetch(
        `https://exam-app.elevate-bootcamp.cloud/api/questions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data;
    },
  });
}