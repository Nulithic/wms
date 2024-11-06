import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleUpdateMenuItemGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groups } = body;

    const { data, error } = await supabase.from("menu_item_groups").upsert(groups).select();

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
