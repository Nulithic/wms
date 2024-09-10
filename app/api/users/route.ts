import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import handleGetAllUsers from "./getUsers";
import handleAddUser from "./addUser";
import handleDeleteUser from "./deleteUser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  const { action, ...body } = await request.json();

  switch (action) {
    case "getUsers":
      return handleGetAllUsers(supabase, body);

    case "addUser":
      return handleAddUser(supabase, body);

    case "deleteUser":
      return handleDeleteUser(supabase, body);

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}