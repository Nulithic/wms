import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleDeleteMenuItem = async (supabase: SupabaseClient, body: any) => {
  try {
    const { id } = body;

    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleDeleteMenuItem;
