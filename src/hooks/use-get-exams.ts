import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ExamParams {
  page: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  diplomaId: string;
  immutable: string;
}

export default function useGetExams(params: ExamParams) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", params.page.toString());
      searchParams.set("limit", "20");
      if (params.search) searchParams.set("search", params.search);
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
      if (params.diplomaId && params.diplomaId !== "all") searchParams.set("diplomaId", params.diplomaId);
      if (params.immutable) searchParams.set("immutable", params.immutable);

      const res = await axios.get(`/api/admin/exams?${searchParams}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
}