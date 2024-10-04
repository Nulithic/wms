import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleRemoveUserFromGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId, userId } = body;

    const { error } = await supabase.from("group_users").delete().match({ group_id: groupId, user_id: userId });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleRemoveUserFromGroup;
