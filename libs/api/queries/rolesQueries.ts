import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { RoleData, PageData } from "../types";

export function useRoles() {
  return {
    getRoles: (pageData: PageData) =>
      useQuery({
        queryKey: ["roles", pageData],
        queryFn: () => apiClient.roles.getRoles(pageData),
        select: (response) => response.data,
      }),

    addRole: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (roleData: Partial<RoleData>) => apiClient.roles.addRole(roleData),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
      });
    },

    deleteRole: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: (roleId: string) => apiClient.roles.deleteRole(roleId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
      });
    },
  };
}
