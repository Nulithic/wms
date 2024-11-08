import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export function useUserMenuItems() {
  return useQuery({
    queryKey: ["userMenuItems"],
    queryFn: () => apiClient.userMenuItems.getUserMenuItems(),
    select: (response) => response.data,
  });
}
