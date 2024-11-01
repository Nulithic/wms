import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleUpdateMenuItem = async (supabase: SupabaseClient, body: any) => {
  try {
    const { menuItems } = body;

    if (!Array.isArray(menuItems)) {
      return NextResponse.json({ error: "Invalid input: expected an array of menu items" }, { status: 400 });
    }

    const updates = menuItems.map(({ id, title, path, order_index, parent_id, group_id }) => ({
      id,
      title,
      path,
      order_index,
      parent_id,
      group_id,
    }));

    const { data, error } = await supabase.from("menu_items").upsert(updates).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleUpdateMenuItem;
