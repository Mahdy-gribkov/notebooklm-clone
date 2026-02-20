import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the AI SDK modules
vi.mock("@ai-sdk/groq", () => ({
  createGroq: vi.fn(() => vi.fn(() => "groq-model")),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn(() => "google-model")),
}));

describe("getLLM", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.GROQ_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  it("returns Groq model when GROQ_API_KEY is set", async () => {
    process.env.GROQ_API_KEY = "groq-key";
    process.env.GEMINI_API_KEY = "gemini-key";
    const { getLLM } = await import("@/lib/llm");
    const model = getLLM();
    expect(model).toBe("groq-model");
  });

  it("returns Google model when only GEMINI_API_KEY is set", async () => {
    process.env.GEMINI_API_KEY = "gemini-key";
    const { getLLM } = await import("@/lib/llm");
    const model = getLLM();
    expect(model).toBe("google-model");
  });

  it("throws when neither key is set", async () => {
    const { getLLM } = await import("@/lib/llm");
    expect(() => getLLM()).toThrow("GROQ_API_KEY or GEMINI_API_KEY is required");
  });
});

describe("embedQuery", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.GEMINI_API_KEY = "test-gemini-key";
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns 768-element array on success", async () => {
    const values = Array.from({ length: 768 }, (_, i) => i * 0.001);
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ embedding: { values } }), { status: 200 })
    );

    const { embedQuery } = await import("@/lib/llm");
    const result = await embedQuery("test text");
    expect(result).toHaveLength(768);
    expect(result[0]).toBe(0);
  });

  it("throws on API error with status", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Rate limited", { status: 429 })
    );

    const { embedQuery } = await import("@/lib/llm");
    await expect(embedQuery("test")).rejects.toThrow("429");
  });

  it("throws when GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const { embedQuery } = await import("@/lib/llm");
    await expect(embedQuery("test")).rejects.toThrow("GEMINI_API_KEY is required");
  });

  it("throws on wrong dimension count", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ embedding: { values: [0.1, 0.2, 0.3] } }),
        { status: 200 }
      )
    );

    const { embedQuery } = await import("@/lib/llm");
    await expect(embedQuery("test")).rejects.toThrow("Unexpected embedding shape");
  });

  it("uses x-goog-api-key header", async () => {
    const values = Array.from({ length: 768 }, () => 0.1);
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ embedding: { values } }), { status: 200 })
    );

    const { embedQuery } = await import("@/lib/llm");
    await embedQuery("test");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("embedContent"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-goog-api-key": "test-gemini-key",
        }),
      })
    );
  });
});
