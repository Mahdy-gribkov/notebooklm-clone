import { authenticateRequest } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import { processNotebook } from "@/lib/rag";
import { updateNotebookStatus } from "@/lib/notebook-status";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(request);
  if (auth === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: notebookId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify notebook ownership
  const { data: notebook } = await supabase
    .from("notebooks")
    .select("id")
    .eq("id", notebookId)
    .eq("user_id", user.id)
    .single();

  if (!notebook) {
    return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
  }

  const { data: files, error } = await supabase
    .from("notebook_files")
    .select("*")
    .eq("notebook_id", notebookId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[notebooks/files] Failed to fetch files:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json(files ?? []);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest(request);
  if (auth === null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: notebookId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(user.id + ":upload", 3, 3_600_000)) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait before uploading again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Verify notebook ownership
  const { data: notebook } = await supabase
    .from("notebooks")
    .select("id")
    .eq("id", notebookId)
    .eq("user_id", user.id)
    .single();

  if (!notebook) {
    return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are supported" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 5MB limit" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.slice(0, 5).toString("ascii") !== "%PDF-") {
    return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
  }

  const serviceClient = getServiceClient();

  const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { error: uploadError } = await serviceClient.storage
    .from("pdf-uploads")
    .upload(storagePath, buffer, { contentType: "application/pdf" });

  if (uploadError) {
    console.error("[notebooks/files] Storage upload failed:", uploadError);
    return NextResponse.json(
      { error: "Storage upload failed" },
      { status: 500 }
    );
  }

  const { data: notebookFile, error: dbError } = await serviceClient
    .from("notebook_files")
    .insert({
      notebook_id: notebookId,
      user_id: user.id,
      file_name: file.name,
      storage_path: storagePath,
      status: "processing",
    })
    .select()
    .single();

  if (dbError || !notebookFile) {
    console.error("[notebooks/files] Failed to create notebook_file:", dbError);
    await serviceClient.storage.from("pdf-uploads").remove([storagePath]);
    return NextResponse.json(
      { error: "Failed to create file record" },
      { status: 500 }
    );
  }

  // Update notebook status to processing
  await serviceClient
    .from("notebooks")
    .update({ status: "processing" })
    .eq("id", notebookId);

  try {
    const result = await processNotebook(
      notebookId,
      user.id,
      buffer,
      notebookFile.id,
      file.name
    );

    await serviceClient
      .from("notebook_files")
      .update({ status: "ready", page_count: result.pageCount })
      .eq("id", notebookFile.id);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[notebooks/files] Processing failed:", {
      notebookFileId: notebookFile.id,
      errorMessage: errorMsg,
    });

    await serviceClient
      .from("notebook_files")
      .update({ status: "error" })
      .eq("id", notebookFile.id);

    await serviceClient.storage
      .from("pdf-uploads")
      .remove([storagePath])
      .then(null, (e: unknown) =>
        console.error("[notebooks/files] Failed to clean up storage:", e)
      );
  }

  // Recompute notebook status from all files
  await updateNotebookStatus(notebookId);

  const { data: updated } = await serviceClient
    .from("notebook_files")
    .select("*")
    .eq("id", notebookFile.id)
    .single();

  return NextResponse.json(updated, { status: 201 });
}
