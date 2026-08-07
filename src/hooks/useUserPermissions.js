import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getTokens } from "@/lib/tokenStore";
import { useProfile } from "@/hooks/useProfile";

export function useUserPermissions() {
  const { data: profile } = useProfile();
  const userId = profile?.itemId;
  const organizationId = profile?.organizationId;

  return useQuery({
    queryKey: ["user-permissions", userId, organizationId],
    enabled: Boolean(userId && organizationId),
    queryFn: async () => {
      const tokens = getTokens();
      const { data } = await api.get(
        `https://api.seliseblocks.com/iam/v4/iam/users/${userId}`,
        {
          params: { organizationId },
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
