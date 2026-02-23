import { createHash } from "node:crypto";

/**
 * Generates a SHA-256 hash of the provided text.
 * Used for tracking content state to prevent redundant generations.
 */
export function generateHash(text: string): string {
    if (!text) return "";
    return createHash("sha256").update(text).digest("hex");
}
