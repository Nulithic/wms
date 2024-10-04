import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import handleGetGroups from "./getGroups";
import handleAddGroup from "./addGroup";
import handleDeleteGroup from "./deleteGroup";
import handleGetGroup from "./getGroup";
import handleGetGroupUsers from "./getGroupUsers";
import handleAddUserToGroup from "./addUserToGroup";
import handleRemoveUserFromGroup from "./removeUserFromGroup";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const { action, ...body } = await request.json();

    switch (action) {
      case "getGroups":
        return handleGetGroups(supabase, body);

      case "getGroup":
        return handleGetGroup(supabase, body);

      case "addGroup":
        return handleAddGroup(supabase, body);

      case "deleteGroup":
        return handleDeleteGroup(supabase, body);

      case "getGroupUsers":
        return handleGetGroupUsers(supabase, body);

      case "addUserToGroup":
        return handleAddUserToGroup(supabase, body);

      case "removeUserFromGroup":
        return handleRemoveUserFromGroup(supabase, body);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
