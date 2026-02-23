import { createHash } from "node:crypto";
import { sanitizeText } from "./validate";

/**
 * Standardized hashing function for notebook content snapshots.
 * Ensures that both live generations and cloned featured content
 * produce the exact same hash for caching.
 *
 * It applies sanitization, trims whitespace, and limits to 30,000 chars
 * to match the RAG retrieval limit used in the studio API.
 */
export function getNotebookHash(text: string): string {
    if (!text) return "";

    // 1. Sanitize (removes non-printable chars and injection markers)
    const sanitized = sanitizeText(text);

    // 2. Normalize whitespace (collapse multiple newlines/spaces)
    const normalized = sanitized
        .replace(/\s+/g, " ")
        .trim();

    // 3. Slice to match RAG retrieval limit (30k chars)
    const snapshot = normalized.slice(0, 30_000);

    // 4. Deterministic SHA-256
    return createHash("sha256").update(snapshot).digest("hex");
}

/**
 * Legacy alias to avoid breaking existing imports immediately.
 * @deprecated Use getNotebookHash instead.
 */
export function generateHash(text: string): string {
    return getNotebookHash(text);
}
