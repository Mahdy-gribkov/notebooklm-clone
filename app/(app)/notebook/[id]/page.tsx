import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotebookLayout } from "@/components/notebook-layout";
import type { Notebook, NotebookFile, Message } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotebookPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notebook } = await supabase
    .from("notebooks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single<Notebook>();

  if (!notebook) notFound();

  // Fetch files for this notebook
  const { data: files } = await supabase
    .from("notebook_files")
    .select("*")
    .eq("notebook_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("notebook_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <NotebookLayout
      notebookId={id}
      notebookTitle={notebook.title}
      notebookFiles={(files ?? []) as NotebookFile[]}
      initialMessages={(messages ?? []) as Message[]}
    />
  );
}
