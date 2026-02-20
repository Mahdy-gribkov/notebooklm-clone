import { authenticateRequest } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NotebookFile } from "@/types";

const NOTEBOOK_COLUMNS = "id, user_id, title, file_url, status, page_count, description, created_at";
const FILE_COLUMNS = "id, notebook_id, user_id, file_name, storage_path, status, page_count, created_at";

export async function GET(request: Request) {
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

  const { data, error } = await supabase
    .from("notebooks")
    .select(NOTEBOOK_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[notebooks] Failed to fetch notebooks:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  const notebooks = data ?? [];

  // Optional batch include of files (avoids N+1 on dashboard)
  const url = new URL(request.url);
  if (url.searchParams.get("include") === "files" && notebooks.length > 0) {
    const notebookIds = notebooks.map((n) => n.id);
    const { data: allFiles } = await supabase
      .from("notebook_files")
      .select(FILE_COLUMNS)
      .in("notebook_id", notebookIds)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const filesByNotebook: Record<string, NotebookFile[]> = {};
    for (const file of (allFiles ?? []) as NotebookFile[]) {
      const nid = file.notebook_id;
      if (!filesByNotebook[nid]) filesByNotebook[nid] = [];
      filesByNotebook[nid].push(file);
    }

    return NextResponse.json({ notebooks, filesByNotebook });
  }

  return NextResponse.json(notebooks);
}
