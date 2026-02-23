import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/validate";
import { NotebookLayout } from "@/components/notebook-layout";
import type { Notebook, NotebookFile, Message } from "@/types";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotebookPage({ params }: PageProps) {
  const { id } = await params;
  if (!isValidUUID(id)) notFound();
  const t = await getTranslations("featured");
  const tf = await getTranslations("featured"); // Fallback for direct description if not a key
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notebook } = await supabase
    .from("notebooks")
    .select("id, user_id, title, file_url, status, page_count, description, starter_prompts, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single<Notebook>();

  if (!notebook) notFound();

  // Fetch files for this notebook
  const { data: files } = await supabase
    .from("notebook_files")
    .select("id, notebook_id, user_id, file_name, storage_path, status, page_count, created_at")
    .eq("notebook_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, notebook_id, user_id, role, content, sources, created_at")
    .eq("notebook_id", id)
    .eq("user_id", user.id)
    .eq("is_public", false)
    .order("created_at", { ascending: true });

  return (
    <NotebookLayout
      notebookId={id}
      notebookTitle={notebook.title}
      notebookFiles={(files ?? []) as NotebookFile[]}
      initialMessages={(messages ?? []) as Message[]}
      notebookDescription={
        notebook.description?.startsWith("featured.")
          ? t(notebook.description.replace("featured.", ""))
          : notebook.description
      }
      starterPrompts={notebook.starter_prompts}
    />
  );
}
