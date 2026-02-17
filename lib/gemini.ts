import { GoogleGenerativeAI } from "@google/generative-ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required");

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// For Vercel AI SDK streaming
export const google = createGoogleGenerativeAI({ apiKey });
export const llm = google("gemini-2.5-flash-latest");

// For embeddings (direct SDK)
export const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});
