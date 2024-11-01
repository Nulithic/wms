import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetGroupUsers = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId } = body;

    const { data, error } = await supabase.from("user_groups").select("users(*)").eq("group_id", groupId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const users = data.map((item) => item.users);
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetGroupUsers;
