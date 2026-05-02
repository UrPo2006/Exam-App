import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGetDiplomasList() {
  return useQuery({
    queryKey: ["diplomas-list"],
    queryFn: async () => {
      const res = await axios.get("/api/admin?limit=100");
      console.log(res.data);
      return res.data?.payload?.data || [];
    },
  });
}