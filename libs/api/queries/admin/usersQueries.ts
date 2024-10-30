import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { UserData, PageData } from "../../types";

export function useUsers() {
  const queryClient = useQueryClient();

  return {
    getUsers: (pageData: PageData) =>
      useQuery({
        queryKey: ["users", pageData],
        queryFn: () => apiClient.users.getUsers(pageData),
        select: (response) => response.data,
      }),

    getUser: (userId: string) =>
      useQuery({
        queryKey: ["user", userId],
        queryFn: () => apiClient.users.getUser(userId),
        select: (response) => response.data,
      }),

    addUser: () => {
      return useMutation({
        mutationFn: (userData: Partial<UserData>) => apiClient.users.addUser(userData),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
    },

    deleteUser: () => {
      return useMutation({
        mutationFn: (userId: string) => apiClient.users.deleteUser(userId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
    },
  };
}
