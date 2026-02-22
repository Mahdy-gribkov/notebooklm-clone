import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMS = 768;

let instance: GoogleGenerativeAIEmbeddings | null = null;

/** LangChain-compatible embeddings instance (for future LCEL pipelines). */
export function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (instance) return instance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for embeddings");
  instance = new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: EMBEDDING_MODEL,
  });
  return instance;
}

/**
 * Embed text via Gemini REST API with explicit outputDimensionality.
 * Uses the direct REST API (not the @google/generative-ai SDK) to ensure
 * embedding compatibility with chunks stored in the database.
 */
export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      outputDimensionality: EMBEDDING_DIMS,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Embedding API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const values: number[] = data?.embedding?.values;

  if (!Array.isArray(values) || values.length !== EMBEDDING_DIMS) {
    throw new Error(
      `Unexpected embedding shape: expected ${EMBEDDING_DIMS}, got ${values?.length ?? "undefined"}`
    );
  }

  return values;
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((t) => embedQuery(t)));
}
