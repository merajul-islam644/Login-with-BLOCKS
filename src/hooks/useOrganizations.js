import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getTokens } from "@/lib/tokenStore";

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const tokens = getTokens();
      const { data } = await api.get(
        "https://api.seliseblocks.com/iam/v4/iam/organizations",
        {
          params: {
            Page: 0,
            PageSize: 20,
            "Sort.Property": "Name",
            "Sort.IsDescending": false,
          },
          headers: {
            "x-blocks-key": import.meta.env.VITE_X_BLOCKS_KEY,
            Authorization: `Bearer ${tokens?.accessToken}`,
            Accept: "application/json",
          },
        },
      );
      return data;
    },
  });
}
