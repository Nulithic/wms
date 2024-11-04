import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleAddMenuItemGroupToGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId, menuItemGroupId } = body;

    const { error } = await supabase
      .from("menu_groups")
      .insert({ group_id: groupId, menu_item_group_id: menuItemGroupId });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleAddMenuItemGroupToGroup;
