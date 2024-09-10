import { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const handleAddUser = async (supabase: SupabaseClient, request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleAddUser;
