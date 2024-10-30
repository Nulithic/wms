import { AxiosInstance } from "axios";
import { MenuItemData, PageData } from "../../types";

const BASE_URL = "/admin/menu-items";

export const createMenuItemEndpoints = (instance: AxiosInstance) => ({
  getMenuItems: () => instance.post<MenuItemData[]>(BASE_URL, { action: "getMenuItems" }),

  addMenuItem: (menuItem: Omit<MenuItemData, "id">) =>
    instance.post<MenuItemData>(BASE_URL, { action: "addMenuItem", ...menuItem }),

  updateMenuItem: (menuItems: MenuItemData | MenuItemData[]) =>
    instance.post<MenuItemData[]>(BASE_URL, { action: "updateMenuItem", menuItems }),

  deleteMenuItem: (id: string) => instance.post<void>(BASE_URL, { action: "deleteMenuItem", id }),
});
