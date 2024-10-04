import { AxiosInstance } from "axios";
import { GroupData, PageData, GroupDataResponse, UserData } from "../../types";

const BASE_URL = "/admin/groups";

export const createGroupEndpoints = (instance: AxiosInstance) => ({
  getGroups: (pageData: PageData) => instance.post<GroupDataResponse>(BASE_URL, { action: "getGroups", ...pageData }),
  getGroup: (groupId: string) => instance.post<GroupData>(BASE_URL, { action: "getGroup", groupId }),
  addGroup: (groupData: Partial<GroupData>) => instance.post<GroupData>(BASE_URL, { action: "addGroup", ...groupData }),
  deleteGroup: (groupId: string) => instance.post<void>(BASE_URL, { action: "deleteGroup", groupId }),

  getGroupUsers: (groupId: string) => instance.post<UserData[]>(BASE_URL, { action: "getGroupUsers", groupId }),
  addUserToGroup: (groupId: string, userId: string) =>
    instance.post<void>(BASE_URL, { action: "addUserToGroup", groupId, userId }),
  removeUserFromGroup: (groupId: string, userId: string) =>
    instance.post<void>(BASE_URL, { action: "removeUserFromGroup", groupId, userId }),
});
