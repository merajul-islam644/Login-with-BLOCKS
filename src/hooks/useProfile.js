import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getTokens } from "@/lib/tokenStore";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const tokens = getTokens();
      const { data } = await api.get(
        "https://api.seliseblocks.com/iam/v4/iam/me",
        {
          headers: {
            "x-blocks-key": import.meta.env.VITE_X_BLOCKS_KEY,
            Authorization: `Bearer ${tokens?.accessToken}`,
            Accept: "application/json",
          },
        },
      );
      return data.data;
    },
  });
}
