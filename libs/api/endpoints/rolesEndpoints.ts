import { AxiosInstance } from "axios";
import { RoleData, PageData } from "../types";

export const createRoleEndpoints = (instance: AxiosInstance) => ({
  getRoles: (pageData: PageData) => instance.post<RoleData[]>("/roles", { action: "getRoles", ...pageData }),
  addRole: (roleData: Partial<RoleData>) => instance.post<RoleData>("/roles", { action: "addRole", ...roleData }),
  deleteRole: (roleId: string) => instance.post<void>("/roles", { action: "deleteRole", roleId }),
});
