import { createClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import { checkRateLimit } from "@/lib/rate-limit";
import { getFeaturedBySlug } from "@/lib/featured-notebooks";
import { getFeaturedContent } from "@/lib/featured-content";
import type { FeaturedStudioContent } from "@/lib/featured-content";
import { embedText } from "@/lib/rag";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getNotebookHash } from "@/lib/hash";
import { NextResponse } from "next/server";

export const maxDuration = 120;

async function generateCompanyContent(
  name: string,
  website: string,
  category: string,
): Promise<FeaturedStudioContent | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const prompt = `Write a comprehensive, factual company profile for ${name} (${website}) using current information as of February 2026.
Category: ${category}

Write 1500-2500 words covering:
1. Company Overview - what they do, when founded, headquarters, key leadership
2. Products & Services - main offerings, key features, pricing model
3. Technology Stack & Engineering - known technologies, engineering culture, open source contributions
4. Market Position - competitors, market share, unique value proposition
5. Company Culture - work environment, values, employee reviews highlights
6. Recent Developments - latest funding rounds, product launches, partnerships, acquisitions
7. Career Opportunities - typical engineering roles, what they look for in candidates

Write in a professional but engaging tone. Use markdown headers (##) for each section.
Be factual and specific. Include real metrics, funding amounts, and employee counts where available.
If you are unsure about something, say "reportedly" or omit it.`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const profileText: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (profileText.length < 200) return null;

    const fileName = `${name} Company Profile.pdf`;
    return {
      description: `AI-generated analysis of ${name}, a ${category} company.`,
      files: [{ fileName, content: profileText }],
      quiz: [
        { question: `What category does ${name} belong to?`, options: [category, "E-commerce", "HealthTech", "Gaming"], correctIndex: 0, explanation: `${name} is a ${category} company based in Israel.` },
      ],
      flashcards: [{ front: name, back: `${category} company. Website: ${website}` }],
      report: [{ heading: "Company Summary", content: `${name} is an Israeli tech company in the ${category} space. Visit ${website} for more information.` }],
      mindmap: { label: name, children: [{ label: "Products" }, { label: "Engineering" }, { label: "Culture" }] },
      datatable: { columns: ["Attribute", "Details"], rows: [["Name", name], ["Website", website], ["Category", category], ["HQ", "Israel"]] },
      infographic: [{ heading: "Overview", content: `${name} operates in ${category}.` }],
      slidedeck: [{ heading: name, content: `A ${category} company from Israel.` }],
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 5 clones per hour per user
  if (!checkRateLimit(`user:${user.id}:clone-featured`, 5, 3_600_000)) {
    return NextResponse.json(
      { error: "Limit reached. You can clone up to 5 featured notebooks per hour." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const featured = getFeaturedBySlug(slug);

  if (!featured) {
    return NextResponse.json({ error: "Featured notebook not found" }, { status: 404 });
  }

  let content = getFeaturedContent(slug);
  if (!content && featured.website) {
    content = await generateCompanyContent(
      featured.titleKey,
      featured.website,
      featured.category,
    );
  }

  if (!content) {
    return NextResponse.json({ error: "Failed to generate content for this company" }, { status: 500 });
  }

  const title = slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const serviceClient = getServiceClient();

  const fullText = content.files.map((f) => f.content).join("\n\n");
  const sourceHash = getNotebookHash(fullText);

  let notebook;
  try {
    const { data, error: nbError } = await supabase
      .from("notebooks")
      .insert({
        title,
        user_id: user.id,
        status: "processing",
        description: `featured.${featured.descriptionKey}`,
        source_hash: sourceHash,
      })
      .select("id")
      .single();

    if (nbError) {
      const { data: retryData, error: retryError } = await supabase
        .from("notebooks")
        .insert({
          title,
          user_id: user.id,
          status: "processing",
          description: `featured.${featured.descriptionKey}`,
        })
        .select("id")
        .single();

      if (retryError) throw retryError;
      notebook = retryData;
    } else {
      notebook = data;
    }
  } catch (e) {
    console.error("[clone-featured] Failed to create notebook:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Database error. Please try again later." }, { status: 500 });
  }

  if (!notebook) {
    return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 });
  }

  const fileEntries: { id: string; fileName: string; content: string }[] = [];
  let totalPages = 0;

  for (const file of content.files) {
    const estimatedPages = Math.max(1, Math.ceil(file.content.length / 3000));
    totalPages += estimatedPages;

    try {
      const { data: notebookFile, error: fileError } = await supabase
        .from("notebook_files")
        .insert({
          notebook_id: notebook.id,
          user_id: user.id,
          file_name: file.fileName,
          storage_path: `featured/${slug}/${file.fileName}`,
          status: "processing",
          page_count: estimatedPages,
        })
        .select("id")
        .single();

      if (fileError) continue;

      if (notebookFile) {
        fileEntries.push({
          id: notebookFile.id,
          fileName: file.fileName,
          content: file.content,
        });
      }
    } catch {
      continue;
    }
  }

  const actions: { action: string; result: unknown }[] = [
    { action: "quiz", result: content.quiz },
    { action: "flashcards", result: content.flashcards },
    { action: "report", result: content.report },
    { action: "mindmap", result: content.mindmap },
    { action: "datatable", result: content.datatable },
    { action: "infographic", result: content.infographic },
    { action: "slidedeck", result: content.slidedeck },
  ];

  try {
    const { error: genError } = await supabase
      .from("studio_generations")
      .insert(
        actions.map((a) => ({
          notebook_id: notebook.id,
          user_id: user.id,
          action: a.action,
          result: a.result,
          source_hash: sourceHash,
        })),
      );

    if (genError) {
      const { error: retryGenError } = await supabase
        .from("studio_generations")
        .insert(
          actions.map((a) => ({
            notebook_id: notebook.id,
            user_id: user.id,
            action: a.action,
            result: a.result,
          })),
        );
      if (retryGenError) throw retryGenError;
    }
  } catch (e) {
    console.error("[clone-featured] Studio generation insertion failed:", e instanceof Error ? e.message : e);
  }

  if (fileEntries.length > 0) {
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
      });

      let globalChunkIndex = 0;
      const allChunkRows: {
        notebook_id: string;
        user_id: string;
        content: string;
        embedding: string;
        chunk_index: number;
        metadata: { file_id: string; file_name: string };
      }[] = [];

      for (const file of fileEntries) {
        const docs = await splitter.createDocuments([file.content]);
        const chunks = docs.map((d) => d.pageContent);

        const BATCH_SIZE = 5;
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
          const batch = chunks.slice(i, i + BATCH_SIZE);
          const embeddings = await Promise.all(batch.map((chunk) => embedText(chunk)));

          for (let idx = 0; idx < batch.length; idx++) {
            allChunkRows.push({
              notebook_id: notebook.id,
              user_id: user.id,
              content: batch[idx],
              embedding: JSON.stringify(embeddings[idx]),
              chunk_index: globalChunkIndex++,
              metadata: { file_id: file.id, file_name: file.fileName },
            });
          }

          // Rate limit delay between batches within a file
          // Optimized: Featured content is small, use 3s delay instead of 6.5s
          if (i + BATCH_SIZE < chunks.length) {
            await new Promise((r) => setTimeout(r, 3000));
          }
        }
      }

      if (allChunkRows.length > 0) {
        const { error: chunkError } = await serviceClient.from("chunks").insert(allChunkRows);
        if (chunkError) throw new Error("Failed to store document chunks");
      }

      await serviceClient
        .from("notebook_files")
        .update({ status: "ready" })
        .eq("notebook_id", notebook.id)
        .eq("user_id", user.id);

      await serviceClient
        .from("notebooks")
        .update({ status: "ready", page_count: totalPages })
        .eq("id", notebook.id);
    } catch (e) {
      console.error("[clone-featured] Embedding failed:", e instanceof Error ? e.message : e);


      await serviceClient
        .from("notebooks")
        .update({ status: "error" })
        .eq("id", notebook.id);

      await serviceClient
        .from("notebook_files")
        .update({ status: "error" })
        .eq("notebook_id", notebook.id)
        .eq("user_id", user.id);

      return NextResponse.json({ error: "Failed to process featured content" }, { status: 500 });
    }
  }

  return NextResponse.json({ notebookId: notebook.id }, { status: 201 });
}
