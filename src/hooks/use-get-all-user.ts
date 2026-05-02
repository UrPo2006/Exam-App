import { useQuery } from "@tanstack/react-query";

interface Params {
  token: string;
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function useGetAllUser({
  token,
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}: Params) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  return useQuery({
    queryKey: ["users", page, limit, search, sortBy, sortOrder],

    queryFn: async () => {
      const res = await fetch(
        `https://exam-app.elevate-bootcamp.cloud/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.json();
    },

    enabled: !!token,
  });
}