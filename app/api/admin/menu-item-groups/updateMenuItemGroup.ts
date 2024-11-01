import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleUpdateMenuItemGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { id, name, order_index } = body;

    const { data, error } = await supabase
      .from("menu_item_groups")
      .update({ name, order_index })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleUpdateMenuItemGroup;
