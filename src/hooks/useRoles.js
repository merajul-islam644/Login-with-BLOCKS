import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getTokens } from "@/lib/tokenStore";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const tokens = getTokens();
      const { data } = await api.post(
        "https://api.seliseblocks.com/iam/v4/iam/roles",
        {
          page: 0,
          pageSize: 50,
          sort: { property: "name", isDescending: false },
          filter: { search: "", slugs: [] },
        },
        {
          headers: {
            "x-blocks-key": import.meta.env.VITE_X_BLOCKS_KEY,
            Authorization: `Bearer ${tokens?.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      return data.data;
    },
  });
}
