import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleDeleteMenuItemGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { id } = body;

    // Delete the group - all related menu items will be automatically deleted
    const { error } = await supabase.from("menu_item_groups").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleDeleteMenuItemGroup;
