interface ChatMessage {
  role: string;
  content: string;
}

/**
 * Trim message history to fit within a character budget.
 * Uses character count as a proxy for tokens (~4 chars/token).
 * Always keeps the last user message. Removes oldest messages first.
 */
export function trimMessages<T extends ChatMessage>(
  messages: T[],
  maxChars = 12_000,
): T[] {
  if (messages.length === 0) return [];

  const last = messages[messages.length - 1];
  const history = messages.slice(0, -1);

  let totalChars = last.content.length;
  const kept: T[] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const msgChars = history[i].content.length;
    if (totalChars + msgChars > maxChars) break;
    totalChars += msgChars;
    kept.unshift(history[i]);
  }

  kept.push(last);
  return kept;
}
