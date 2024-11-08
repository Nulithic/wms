import axios, { AxiosInstance } from "axios";
import { createUserEndpoints } from "./endpoints/admin/usersEndpoints";
import { createGroupEndpoints } from "./endpoints/admin/groupsEndpoints";
import { createMenuItemEndpoints } from "./endpoints/admin/menuItemEndpoints";
import { createMenuItemGroupEndpoints } from "./endpoints/admin/menuItemGroupEndpoints";
import { createUserMenuItemEndpoints } from "./endpoints/menuItemEndpoints";

const BASE_URL = "/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createApiClient = (instance: AxiosInstance) => ({
  users: createUserEndpoints(instance),
  groups: createGroupEndpoints(instance),
  menuItems: createMenuItemEndpoints(instance),
  menuItemGroups: createMenuItemGroupEndpoints(instance),
  userMenuItems: createUserMenuItemEndpoints(instance),
});

export const apiClient = createApiClient(axiosInstance);

// You can also export the type of the apiClient for better type inference
export type ApiClient = ReturnType<typeof createApiClient>;
