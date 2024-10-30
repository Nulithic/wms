import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../apiClient";
import { MenuItemData } from "../../types";

export function useMenuItems() {
  const queryClient = useQueryClient();

  const getMenuItems = () =>
    useQuery({
      queryKey: ["menuItems"],
      queryFn: () => apiClient.menuItems.getMenuItems(),
      select: (response) => response.data,
    });

  const addMenuItemMutation = useMutation({
    mutationFn: (menuItem: Omit<MenuItemData, "id">) => apiClient.menuItems.addMenuItem(menuItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: (menuItems: MenuItemData | MenuItemData[]) => apiClient.menuItems.updateMenuItem(menuItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: string) => apiClient.menuItems.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });

  return {
    getMenuItems,
    addMenuItem: addMenuItemMutation.mutateAsync,
    updateMenuItem: updateMenuItemMutation.mutateAsync,
    deleteMenuItem: deleteMenuItemMutation.mutateAsync,
  };
}
