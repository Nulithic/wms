import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleAddUserToGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId, userId } = body;

    // Check if the user is already in the group
    const { data: existingMembership, error: checkError } = await supabase
      .from("user_groups")
      .select()
      .match({ group_id: groupId, user_id: userId })
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is expected if the user is not in the group
      return NextResponse.json({ error: checkError.message }, { status: 400 });
    }

    if (existingMembership) {
      return NextResponse.json({ message: "User is already in the group" }, { status: 200 });
    }

    // Add the user to the group
    const { error: insertError } = await supabase.from("user_groups").insert({ group_id: groupId, user_id: userId });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleAddUserToGroup;
