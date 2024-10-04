import { createGroupHandler } from "@/libs/supabase/groupHandler";

import handleGetUsers from "./getUsers";
import handleAddUser from "./addUser";
import handleDeleteUser from "./deleteUser";
import handleGetUser from "./getUser";

export const POST = createGroupHandler("admin", {
  getUsers: handleGetUsers,
  getUser: handleGetUser,
  addUser: handleAddUser,
  deleteUser: handleDeleteUser,
});
