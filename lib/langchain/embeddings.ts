import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let instance: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (instance) return instance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for embeddings");
  instance = new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: "gemini-embedding-001",
  });
  return instance;
}

export async function embedQuery(text: string): Promise<number[]> {
  return getEmbeddings().embedQuery(text);
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return getEmbeddings().embedDocuments(texts);
}
