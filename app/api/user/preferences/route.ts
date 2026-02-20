import { authenticateRequest } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_AI_STYLES = ["concise", "balanced", "detailed"];

// PATCH /api/user/preferences — update user metadata
export async function PATCH(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, string> = {};

  if (body.ai_style && VALID_AI_STYLES.includes(body.ai_style)) {
    updates.ai_style = body.ai_style;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, ...updates },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
