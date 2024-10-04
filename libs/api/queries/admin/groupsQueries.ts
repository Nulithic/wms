import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { GroupData, PageData } from "../../types";

export function useGroups() {
  const queryClient = useQueryClient();

  const getGroups = (pageData: PageData) =>
    useQuery({
      queryKey: ["groups", pageData],
      queryFn: () => apiClient.groups.getGroups(pageData),
      select: (response) => response.data,
    });

  const getGroup = (groupId: string) =>
    useQuery({
      queryKey: ["group", groupId],
      queryFn: () => apiClient.groups.getGroup(groupId),
      select: (response) => response.data,
    });

  const addGroupMutation = useMutation({
    mutationFn: (groupData: Partial<GroupData>) => apiClient.groups.addGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => apiClient.groups.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const getGroupUsers = (groupId: string) =>
    useQuery({
      queryKey: ["groupUsers", groupId],
      queryFn: () => apiClient.groups.getGroupUsers(groupId),
      select: (response) => response.data,
    });

  const addUserToGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      apiClient.groups.addUserToGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groupUsers", groupId] });
    },
  });

  const removeUserFromGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      apiClient.groups.removeUserFromGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ["groupUsers", groupId] });
    },
  });

  return {
    getGroups,
    getGroup,
    addGroup: addGroupMutation.mutateAsync,
    deleteGroup: deleteGroupMutation.mutateAsync,
    getGroupUsers,
    addUserToGroup: addUserToGroupMutation.mutateAsync,
    removeUserFromGroup: removeUserFromGroupMutation.mutateAsync,
  };
}
