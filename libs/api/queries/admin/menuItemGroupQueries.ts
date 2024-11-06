import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { MenuItemGroupData } from "../../types";

export function useMenuItemGroups() {
  const queryClient = useQueryClient();

  const getMenuItemGroups = () =>
    useQuery({
      queryKey: ["menuItemGroups"],
      queryFn: () => apiClient.menuItemGroups.getMenuItemGroups(),
      select: (response) => response.data,
    });

  const addMenuItemGroupMutation = useMutation({
    mutationFn: (groupData: Omit<MenuItemGroupData, "id">) => apiClient.menuItemGroups.addMenuItemGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemGroups"] });
    },
  });

  const updateMenuItemGroupMutation = useMutation({
    mutationFn: (groupData: MenuItemGroupData[]) => apiClient.menuItemGroups.updateMenuItemGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemGroups"] });
    },
  });

  const deleteMenuItemGroupMutation = useMutation({
    mutationFn: (id: string) => apiClient.menuItemGroups.deleteMenuItemGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItemGroups"] });
    },
  });

  return {
    getMenuItemGroups,
    addMenuItemGroup: addMenuItemGroupMutation.mutateAsync,
    updateMenuItemGroup: updateMenuItemGroupMutation.mutateAsync,
    deleteMenuItemGroup: deleteMenuItemGroupMutation.mutateAsync,
  };
}
