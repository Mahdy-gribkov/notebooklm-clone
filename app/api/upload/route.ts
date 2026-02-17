import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { processNotebook } from "@/lib/rag";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(user.id + ":upload", 3, 3_600_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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

  // Verify PDF magic bytes — prevents MIME spoofing
  if (buffer.slice(0, 5).toString("ascii") !== "%PDF-") {
    return NextResponse.json({ error: "Invalid PDF file" }, { status: 400 });
  }

  const serviceClient = getServiceClient();

  // Store path only — bucket is private, signed URLs generated on demand
  const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const { error: uploadError } = await serviceClient.storage
    .from("pdf-uploads")
    .upload(storagePath, buffer, { contentType: "application/pdf" });

  if (uploadError) {
    console.error("[upload] Storage upload failed:", uploadError);
    return NextResponse.json(
      { error: "Storage upload failed" },
      { status: 500 }
    );
  }

  // Create notebook row with storage path (not public URL)
  const title = file.name.replace(/\.pdf$/i, "");
  const { data: notebook, error: dbError } = await serviceClient
    .from("notebooks")
    .insert({
      user_id: user.id,
      title,
      file_url: storagePath,
      status: "processing",
    })
    .select()
    .single();

  if (dbError || !notebook) {
    console.error("[upload] Failed to create notebook:", dbError);
    return NextResponse.json(
      { error: "Failed to create notebook" },
      { status: 500 }
    );
  }

  // Process synchronously (embed + store chunks) within 60s timeout
  try {
    await processNotebook(notebook.id, user.id, buffer);
  } catch (error) {
    console.error("[upload] Processing failed:", error);
    return NextResponse.json(
      { error: "Processing failed", notebookId: notebook.id },
      { status: 500 }
    );
  }

  // Return the updated notebook
  const { data: updated } = await serviceClient
    .from("notebooks")
    .select("*")
    .eq("id", notebook.id)
    .single();

  return NextResponse.json(updated, { status: 201 });
}
