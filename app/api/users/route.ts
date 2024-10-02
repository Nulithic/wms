import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import handleGetUsers from "./getUsers";
import handleAddUser from "./addUser";
import handleDeleteUser from "./deleteUser";
import handleGetUser from "./getUser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const { action, ...body } = await request.json();

    switch (action) {
      case "getUsers":
        return handleGetUsers(supabase, body);

      case "getUser":
        return handleGetUser(supabase, body);

      case "addUser":
        return handleAddUser(supabase, body);

      case "deleteUser":
        return handleDeleteUser(supabase, body);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
