import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetUser = async (supabase: SupabaseClient, body: any) => {
  try {
    const { userId } = body;

    const { data, error } = await supabase.from("users").select("*").eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetUser;
