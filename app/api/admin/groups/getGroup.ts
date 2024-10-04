import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetGroup = async (supabase: SupabaseClient, body: any) => {
  try {
    const { groupId } = body;

    const { data, error } = await supabase.from("groups").select("*").eq("id", groupId).single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetGroup;
