import { useMutation } from "@tanstack/react-query";

export default function useBulkCreateQuestions(token: string) {
  return useMutation({
    mutationFn: ({ examId, questions }: {
      examId: string;
      questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[];
    }) =>
      fetch(`https://exam-app.elevate-bootcamp.cloud/api/questions/exam/${examId}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions }),
      }).then(r => r.json()),
  });
}