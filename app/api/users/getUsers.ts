import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetAllUsers = async (supabase: SupabaseClient, body: any) => {
  try {
    const { page, perPage } = body;

    console.log(page);

    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: perPage,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(users);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetAllUsers;
