import { createAuthHandler } from "@/libs/supabase/authHandler";
import handleGetUserMenuItems from "./getUserMenuItems";

export const POST = createAuthHandler({
  getUserMenuItems: handleGetUserMenuItems,
});
