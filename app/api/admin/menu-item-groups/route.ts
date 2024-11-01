import { createGroupHandler } from "@/libs/supabase/groupHandler";

import handleGetMenuItemGroups from "./getMenuItemGroups";
import handleAddMenuItemGroup from "./addMenuItemGroup";
import handleUpdateMenuItemGroup from "./updateMenuItemGroup";
import handleDeleteMenuItemGroup from "./deleteMenuItemGroup";

export const POST = createGroupHandler("admin", {
  getMenuItemGroups: handleGetMenuItemGroups,
  addMenuItemGroup: handleAddMenuItemGroup,
  updateMenuItemGroup: handleUpdateMenuItemGroup,
  deleteMenuItemGroup: handleDeleteMenuItemGroup,
});
