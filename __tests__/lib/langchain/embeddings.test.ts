import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@langchain/google-genai", () => {
  const MockEmbeddings = vi.fn(function (this: Record<string, unknown>, opts: Record<string, unknown>) {
    this._type = "mock-embeddings";
    this.apiKey = opts.apiKey;
    this.model = opts.model;
  });
  return { GoogleGenerativeAIEmbeddings: MockEmbeddings };
});

const originalFetch = globalThis.fetch;

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
  globalThis.fetch = originalFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllEnvs();
});

function make768Vector(): number[] {
  return Array.from({ length: 768 }, (_, i) => i * 0.001);
}

describe("getEmbeddings", () => {
  it("returns a GoogleGenerativeAIEmbeddings instance", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const { getEmbeddings } = await import("@/lib/langchain/embeddings");
    const instance = getEmbeddings();
    expect(instance).toBeDefined();
    expect((instance as unknown as Record<string, unknown>)._type).toBe("mock-embeddings");
  });

  it("returns cached singleton on second call", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const { getEmbeddings } = await import("@/lib/langchain/embeddings");
    const a = getEmbeddings();
    const b = getEmbeddings();
    expect(a).toBe(b);
  });

  it("throws without GEMINI_API_KEY", async () => {
    delete process.env.GEMINI_API_KEY;
    const { getEmbeddings } = await import("@/lib/langchain/embeddings");
    expect(() => getEmbeddings()).toThrow("GEMINI_API_KEY is required");
  });
});

describe("embedQuery", () => {
  it("returns 768-dim vector on success", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const vector = make768Vector();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ embedding: { values: vector } }),
    });

    const { embedQuery } = await import("@/lib/langchain/embeddings");
    const result = await embedQuery("test text");

    expect(result).toEqual(vector);
    expect(result).toHaveLength(768);

    const fetchCall = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(fetchCall[0]).toContain("gemini-embedding-001:embedContent");
    const body = JSON.parse(fetchCall[1].body);
    expect(body.outputDimensionality).toBe(768);
  });

  it("throws on API error", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve("Rate limited"),
    });

    const { embedQuery } = await import("@/lib/langchain/embeddings");
    await expect(embedQuery("test")).rejects.toThrow("Embedding API error 429: Rate limited");
  });

  it("throws on unexpected embedding shape", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ embedding: { values: [0.1, 0.2] } }),
    });

    const { embedQuery } = await import("@/lib/langchain/embeddings");
    await expect(embedQuery("test")).rejects.toThrow("Unexpected embedding shape: expected 768, got 2");
  });

  it("throws on missing embedding values", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ embedding: {} }),
    });

    const { embedQuery } = await import("@/lib/langchain/embeddings");
    await expect(embedQuery("test")).rejects.toThrow("Unexpected embedding shape: expected 768, got undefined");
  });

  it("throws without GEMINI_API_KEY", async () => {
    delete process.env.GEMINI_API_KEY;
    const { embedQuery } = await import("@/lib/langchain/embeddings");
    await expect(embedQuery("test")).rejects.toThrow("GEMINI_API_KEY is required");
  });
});

describe("embedDocuments", () => {
  it("embeds multiple texts in parallel", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const vector = make768Vector();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ embedding: { values: vector } }),
    });

    const { embedDocuments } = await import("@/lib/langchain/embeddings");
    const results = await embedDocuments(["text1", "text2", "text3"]);

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual(vector);
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  });
});
