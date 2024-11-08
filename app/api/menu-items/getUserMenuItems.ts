import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const handleGetUserMenuItems = async (supabase: SupabaseClient, user: any) => {
  try {
    // Get all groups the user belongs to
    const { data: userGroups } = await supabase.from("user_groups").select("group_id").eq("user_id", user.id);

    if (!userGroups?.length) {
      return NextResponse.json([]);
    }

    const groupIds = userGroups.map((ug) => ug.group_id);

    // Get all menu item groups assigned to user's groups
    const { data: menuGroups } = await supabase
      .from("menu_groups")
      .select("menu_item_group_id")
      .in("group_id", groupIds);

    if (!menuGroups?.length) {
      return NextResponse.json([]);
    }

    const menuItemGroupIds = menuGroups.map((mg) => mg.menu_item_group_id);

    // Get all menu items that belong to the allowed menu item groups
    const { data: menuItems, error } = await supabase
      .from("menu_items")
      .select("*")
      .in("group_id", menuItemGroupIds)
      .order("order_index");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(menuItems);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

export default handleGetUserMenuItems;
