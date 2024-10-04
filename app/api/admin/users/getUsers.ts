import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetUsers = async (supabase: SupabaseClient, body: any) => {
  try {
    const { page, perPage } = body;

    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    const { users } = data;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(users);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetUsers;
