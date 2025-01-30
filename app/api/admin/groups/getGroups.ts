import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetGroups = async (supabase: SupabaseClient, body: any) => {
  try {
    const { page, perPage } = body;

    const { data, error, count } = await supabase
      .from("groups")
      .select("*", { count: "exact" })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ groups: data, total: count });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetGroups;
