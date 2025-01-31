import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleAddMenuItem = async (supabase: SupabaseClient, body: any) => {
  try {
    const { title, path, parent_id, group_id, order_index } = body;

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        title,
        path,
        parent_id,
        group_id,
        order_index,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error); // Debug log
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleAddMenuItem;
