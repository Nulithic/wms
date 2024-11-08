import { AxiosInstance } from "axios";
import { MenuItemData } from "../types";

const BASE_URL = "/menu-items";

export const createUserMenuItemEndpoints = (instance: AxiosInstance) => ({
  getUserMenuItems: () => instance.post<MenuItemData[]>(BASE_URL, { action: "getUserMenuItems" }),
});
