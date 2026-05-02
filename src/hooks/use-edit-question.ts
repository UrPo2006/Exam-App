import { useMutation } from "@tanstack/react-query";

export default function useEditQuestion(token: string) {
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; text: string; answers: any[] }) =>
      fetch(`https://exam-app.elevate-bootcamp.cloud/api/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).then(r => r.json()),
  });
}