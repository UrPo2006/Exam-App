import { useQuery } from "@tanstack/react-query";

interface Params {
  token: string;
  page: number;
  limit: number;
  search?: string;
  category?: string;
  action?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function useGetAuditLogs({
  token, page, limit, search, category, action, sortBy, sortOrder
}: Params) {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search)    params.append("search", search);
  if (category)  params.append("category", category);
  if (action)    params.append("action", action);
  if (sortBy)    params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);

  return useQuery({
    queryKey: ["audit-logs", page, limit, search, category, action, sortBy, sortOrder],
    queryFn: () =>
      fetch(`https://exam-app.elevate-bootcamp.cloud/api/admin/audit-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => r.json()),
    enabled: !!token,
  });
}