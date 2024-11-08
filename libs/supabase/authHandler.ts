import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";

type HandlerFunction = (supabase: ReturnType<typeof createClient>, user: any, body: any) => Promise<NextResponse>;

export function createAuthHandler(handlers: Record<string, HandlerFunction>) {
  return async function handler(request: NextRequest) {
    const supabase = createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { action, ...body } = await request.json();

      if (action in handlers) {
        return handlers[action](supabase, user, body);
      } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
