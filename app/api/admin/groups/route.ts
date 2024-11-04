import { createGroupHandler } from "@/libs/supabase/groupHandler";

import handleGetGroups from "./getGroups";
import handleAddGroup from "./addGroup";
import handleDeleteGroup from "./deleteGroup";
import handleGetGroup from "./getGroup";
import handleGetGroupUsers from "./getGroupUsers";
import handleAddUserToGroup from "./addUserToGroup";
import handleRemoveUserFromGroup from "./removeUserFromGroup";
import handleGetGroupMenuItemGroups from "./getGroupMenuItemGroups";
import handleAddMenuItemGroupToGroup from "./addMenuItemGroupToGroup";
import handleRemoveMenuItemGroupFromGroup from "./removeMenuItemGroupFromGroup";

export const POST = createGroupHandler("admin", {
  getGroups: handleGetGroups,
  getGroup: handleGetGroup,
  addGroup: handleAddGroup,
  deleteGroup: handleDeleteGroup,
  getGroupUsers: handleGetGroupUsers,
  addUserToGroup: handleAddUserToGroup,
  removeUserFromGroup: handleRemoveUserFromGroup,
  getGroupMenuItemGroups: handleGetGroupMenuItemGroups,
  addMenuItemGroupToGroup: handleAddMenuItemGroupToGroup,
  removeMenuItemGroupFromGroup: handleRemoveMenuItemGroupFromGroup,
});
