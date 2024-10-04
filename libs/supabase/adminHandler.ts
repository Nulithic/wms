import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";
import { adminMiddleware } from "./middleware";

type HandlerFunction = (supabase: ReturnType<typeof createClient>, body: any) => Promise<NextResponse>;

export function createAdminHandler(handlers: Record<string, HandlerFunction>) {
  return async function handler(request: NextRequest) {
    // First, run the admin middleware
    const middlewareResponse = await adminMiddleware(request);
    if (middlewareResponse.status !== 200) {
      return middlewareResponse;
    }

    const supabase = createClient();

    try {
      const { action, ...body } = await request.json();

      if (action in handlers) {
        return handlers[action](supabase, body);
      } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    } catch (error) {
      console.error("API error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}
