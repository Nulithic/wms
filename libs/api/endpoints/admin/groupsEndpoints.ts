import { AxiosInstance } from "axios";
import { GroupData, PageData, GroupDataResponse, UserData, MenuItemGroupData } from "../../types";

const BASE_URL = "/admin/groups";

export const createGroupEndpoints = (instance: AxiosInstance) => ({
  getGroups: (pageData: PageData) => instance.post<GroupDataResponse>(BASE_URL, { action: "getGroups", ...pageData }),
  getGroup: (groupId: string) => instance.post<GroupData>(BASE_URL, { action: "getGroup", groupId }),
  addGroup: (groupData: Partial<GroupData>) => instance.post<GroupData>(BASE_URL, { action: "addGroup", ...groupData }),
  deleteGroup: (groupId: string) => instance.post<void>(BASE_URL, { action: "deleteGroup", groupId }),

  getUsersInGroup: (groupId: string) => instance.post<UserData[]>(BASE_URL, { action: "getUsersInGroup", groupId }),
  addUserToGroup: (groupId: string, userId: string) =>
    instance.post<void>(BASE_URL, { action: "addUserToGroup", groupId, userId }),
  removeUserFromGroup: (groupId: string, userId: string) =>
    instance.post<void>(BASE_URL, { action: "removeUserFromGroup", groupId, userId }),

  getUserMenuItemGroups: ({ groupId }: { groupId: string }) =>
    instance.post<MenuItemGroupData[]>(BASE_URL, { action: "getUserMenuItemGroups", groupId }),
  addMenuItemGroupToGroup: ({ groupId, menuItemGroupId }: { groupId: string; menuItemGroupId: string }) =>
    instance.post<void>(BASE_URL, { action: "addMenuItemGroupToGroup", groupId, menuItemGroupId }),
  removeMenuItemGroupFromGroup: ({ groupId, menuItemGroupId }: { groupId: string; menuItemGroupId: string }) =>
    instance.post<void>(BASE_URL, { action: "removeMenuItemGroupFromGroup", groupId, menuItemGroupId }),
});
