import { AxiosInstance } from "axios";
import { UserData, PageData } from "../types";

export const createUserEndpoints = (instance: AxiosInstance) => ({
  getUsers: (pageData: PageData) => instance.post<UserData[]>("/users", { action: "getUsers", ...pageData }),
  getUser: (userId: string) => instance.post<UserData>("/users", { action: "getUser", userId }),
  addUser: (userData: Partial<UserData>) => instance.post<UserData>("/users", { action: "addUser", ...userData }),
  deleteUser: (userId: string) => instance.post<void>("/users", { action: "deleteUser", userId }),
});
