const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}

export function sanitizeText(text: string): string {
  // Strip null bytes and non-printable control chars (preserve \n \t \r)
  const cleaned = text.replace(/[\x00\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.slice(0, 100_000);
}

export function validateUserMessage(msg: string): string | null {
  if (!msg || msg.trim().length === 0) return "Message cannot be empty";
  if (msg.length > 2000) return "Message exceeds 2000 character limit";
  if (msg.includes("\x00")) return "Invalid characters in message";
  return null;
}
