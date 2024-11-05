import { createGroupHandler } from "@/libs/supabase/groupHandler";

import handleGetGroups from "./getGroups";
import handleAddGroup from "./addGroup";
import handleDeleteGroup from "./deleteGroup";
import handleGetGroup from "./getGroup";
import handleGetUsersInGroup from "./getUsersInGroup";
import handleAddUserToGroup from "./addUserToGroup";
import handleRemoveUserFromGroup from "./removeUserFromGroup";
import handleGetUserMenuItemGroups from "./getUserMenuItemGroups";
import handleAddMenuItemGroupToGroup from "./addMenuItemGroupToGroup";
import handleRemoveMenuItemGroupFromGroup from "./removeMenuItemGroupFromGroup";

export const POST = createGroupHandler("admin", {
  getGroups: handleGetGroups,
  getGroup: handleGetGroup,
  addGroup: handleAddGroup,
  deleteGroup: handleDeleteGroup,
  getUsersInGroup: handleGetUsersInGroup,
  addUserToGroup: handleAddUserToGroup,
  removeUserFromGroup: handleRemoveUserFromGroup,
  getUserMenuItemGroups: handleGetUserMenuItemGroups,
  addMenuItemGroupToGroup: handleAddMenuItemGroupToGroup,
  removeMenuItemGroupFromGroup: handleRemoveMenuItemGroupFromGroup,
});
