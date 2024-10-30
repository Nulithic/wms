import { createGroupHandler } from "@/libs/supabase/groupHandler";

import handleGetMenuItems from "./getMenuItems";
import handleAddMenuItem from "./addMenuItem";
import handleUpdateMenuItem from "./updateMenuItem";
import handleDeleteMenuItem from "./deleteMenuItem";

export const POST = createGroupHandler("admin", {
  getMenuItems: handleGetMenuItems,
  addMenuItem: handleAddMenuItem,
  updateMenuItem: handleUpdateMenuItem,
  deleteMenuItem: handleDeleteMenuItem,
});
