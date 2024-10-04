import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleAddGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { name } = body;

    const { data, error } = await supabase.from("groups").insert({ name }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ group: data });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleAddGroup;
