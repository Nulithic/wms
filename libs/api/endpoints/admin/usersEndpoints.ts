import { AxiosInstance } from "axios";
import { UserData, PageData } from "../../types";

const BASE_URL = "/admin/users";

export const createUserEndpoints = (instance: AxiosInstance) => ({
  getUsers: (pageData: PageData) => instance.post<UserData[]>(BASE_URL, { action: "getUsers", ...pageData }),
  getUser: (userId: string) => instance.post<UserData>(BASE_URL, { action: "getUser", userId }),
  addUser: (userData: Partial<UserData>) => instance.post<UserData>(BASE_URL, { action: "addUser", ...userData }),
  deleteUser: (userId: string) => instance.post<void>(BASE_URL, { action: "deleteUser", userId }),
});
