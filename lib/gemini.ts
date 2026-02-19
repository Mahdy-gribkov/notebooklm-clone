import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getLLM() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required");
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
  return google("gemini-2.5-flash-latest");
}

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMS = 768;

/**
 * Embed text via Gemini REST API with explicit outputDimensionality.
 * The LangChain wrapper doesn't support outputDimensionality, so we call
 * the API directly to keep 768-dim vectors compatible with the pgvector column.
 */
export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      outputDimensionality: EMBEDDING_DIMS,
    }),
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
