import { describe, it, expect } from "vitest";
import { apiError } from "@/lib/api-error";

describe("apiError", () => {
  it("returns correct status code", () => {
    const res = apiError("Not found", 404);
    expect(res.status).toBe(404);
  });

  it("returns error message in JSON body", async () => {
    const res = apiError("Bad request", 400);
    const body = await res.json();
    expect(body).toEqual({ error: "Bad request" });
  });

  it("applies optional headers", () => {
    const res = apiError("Too many requests", 429, { "Retry-After": "60" });
    expect(res.headers.get("Retry-After")).toBe("60");
  });
});
