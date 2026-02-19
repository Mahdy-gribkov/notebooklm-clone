import { jwtVerify } from "jose";

/**
 * Validates the Supabase JWT from the request.
 * Checks Authorization header first, then falls back to Supabase session cookie.
 * Returns the user ID from the JWT 'sub' claim, or null if invalid.
 */
export async function authenticateRequest(
  request: Request
): Promise<{ userId: string } | null> {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) {
    console.error("[auth] SUPABASE_JWT_SECRET is not set");
    return null;
  }

  const token = extractToken(request);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        algorithms: ["HS256"],
      }
    );

    const userId = payload.sub;
    if (!userId || typeof userId !== "string") return null;

    return { userId };
  } catch {
    return null;
  }
}

function extractToken(request: Request): string | null {
  // 1. Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // 2. Supabase session cookie (sb-<ref>-auth-token)
  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.match(/sb-[a-z0-9]+-auth-token=([^;]+)/);
  if (match?.[1]) {
    // Supabase stores a base64-encoded JSON array [access_token, refresh_token]
    try {
      const decoded = decodeURIComponent(match[1]);
      // Handle base64-encoded cookie value
      const parsed = JSON.parse(
        decoded.startsWith("base64-")
          ? Buffer.from(decoded.slice(7), "base64").toString()
          : decoded
      );
      if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        return parsed[0]; // access_token
      }
      if (typeof parsed === "string") return parsed;
    } catch {
      // Not JSON, try using the raw value
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}
