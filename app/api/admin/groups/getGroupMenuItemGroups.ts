import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetGroupMenuItemGroups = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId } = body;

    const { data, error } = await supabase
      .from("menu_groups")
      .select(
        `
        menu_item_group_id,
        menu_item_groups (
          id,
          name,
          order_index
        )
      `,
      )
      .eq("group_id", groupId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data.map((item) => item.menu_item_groups));
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetGroupMenuItemGroups;
