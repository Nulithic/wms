import { AxiosInstance } from "axios";
import { MenuItemGroupData } from "../../types";

const BASE_URL = "/admin/menu-item-groups";

export const createMenuItemGroupEndpoints = (instance: AxiosInstance) => ({
  getMenuItemGroups: () => instance.post<MenuItemGroupData[]>(BASE_URL, { action: "getMenuItemGroups" }),

  addMenuItemGroup: (groupData: Omit<MenuItemGroupData, "id">) =>
    instance.post<MenuItemGroupData>(BASE_URL, { action: "addMenuItemGroup", ...groupData }),

  updateMenuItemGroup: (groupData: MenuItemGroupData) =>
    instance.post<MenuItemGroupData>(BASE_URL, { action: "updateMenuItemGroup", ...groupData }),

  deleteMenuItemGroup: (id: string) => instance.post<void>(BASE_URL, { action: "deleteMenuItemGroup", id }),
});
