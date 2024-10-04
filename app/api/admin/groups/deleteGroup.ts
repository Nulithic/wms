import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleDeleteGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId } = body;

    // First, fetch the group details
    const { data: group, error: fetchError } = await supabase.from("groups").select("code").eq("id", groupId).single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    // Check if the group is the admin group
    if (group.code === "admin") {
      return NextResponse.json({ error: "Cannot delete the admin group" }, { status: 403 });
    }

    // If it's not the admin group, proceed with deletion
    const { error } = await supabase.from("groups").delete().eq("id", groupId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleDeleteGroup;
