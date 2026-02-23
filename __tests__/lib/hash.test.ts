import { describe, it, expect } from "vitest";
import { generateHash } from "@/lib/hash";

describe("generateHash", () => {
    it("returns an empty string for empty input", () => {
        expect(generateHash("")).toBe("");
    });

    it("returns a valid SHA-256 hash for non-empty input", () => {
        const hash = generateHash("hello world");
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
        expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    });

    it("returns the same hash for the same input", () => {
        const input = "stable text content";
        expect(generateHash(input)).toBe(generateHash(input));
    });

    it("returns different hashes for different inputs", () => {
        expect(generateHash("content v1")).not.toBe(generateHash("content v2"));
    });

    it("handles large inputs", () => {
        const largeText = "A".repeat(100_000);
        const hash = generateHash(largeText);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
});
