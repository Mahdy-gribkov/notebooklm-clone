import { authenticateRequest } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if (auth === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let title = "Untitled Notebook";
  try {
    const body = await request.json();
    if (body.title && typeof body.title === "string") {
      title = body.title.trim().slice(0, 200) || title;
    }
  } catch {
    // No body or invalid JSON, use default title
  }

  const serviceClient = getServiceClient();

  const { data: notebook, error } = await serviceClient
    .from("notebooks")
    .insert({
      user_id: user.id,
      title,
      file_url: null,
      status: "ready",
    })
    .select()
    .single();

  if (error || !notebook) {
    console.error("[notebooks/create] Failed to create notebook:", error);
    return NextResponse.json(
      { error: "Failed to create notebook" },
      { status: 500 }
    );
  }

  return NextResponse.json(notebook, { status: 201 });
}
