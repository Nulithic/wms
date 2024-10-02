import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import handleGetRoles from "./getRoles";
import handleAddRole from "./addRole";
import handleDeleteRole from "./deleteRole";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const { action, ...body } = await request.json();

    console.log(body);

    switch (action) {
      case "getRoles":
        return handleGetRoles(supabase, body);

      case "addRole":
        return handleAddRole(supabase, body);

      case "deleteRole":
        return handleDeleteRole(supabase, body);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
