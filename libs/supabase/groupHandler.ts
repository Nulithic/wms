import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./server";
import { groupMiddleware } from "./middleware";

type HandlerFunction = (supabase: ReturnType<typeof createClient>, body: any) => Promise<NextResponse>;

export function createGroupHandler(groupCode: string, handlers: Record<string, HandlerFunction>) {
  return async function handler(request: NextRequest) {
    // First, run the group middleware
    const middlewareResponse = await groupMiddleware(request, groupCode);
    if (middlewareResponse.status !== 200) {
      return middlewareResponse;
    }

    // Use the group Supabase client attached to the request
    const supabase = (request as any).groupSupabase;

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
