import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getTokens } from "@/lib/tokenStore";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const tokens = getTokens();
      const { data } = await api.get("/Notification/Gets", {
        headers: {
          "x-blocks-key": import.meta.env.VITE_X_BLOCKS_KEY,
          Authorization: `Bearer ${tokens?.accessToken}`,
          Accept: "application/json",
        },
      });
      return data;
    },
  });
}
