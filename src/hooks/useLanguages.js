import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data } = await api.get("/Language/Gets");
      return data;
    },
  });
}
