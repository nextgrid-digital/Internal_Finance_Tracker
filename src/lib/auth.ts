/**
 * Minimal shared-password auth for this internal tool.
 *
 * A single password (the `APP_PASSWORD` env var) gates the whole app. On a
 * successful login we store an httpOnly cookie containing a SHA-256 token
 * derived from the password — never the raw password itself. The middleware
 * (`src/proxy.ts`) recomputes the expected token and compares.
 *
 * This runs in both the Edge (middleware) and Node (route handler) runtimes,
 * so it relies only on the Web Crypto API available in both.
 */

export const AUTH_COOKIE = 'finance_auth';

export function getAppPassword(): string | undefined {
  const value = process.env.APP_PASSWORD;
  return value && value.length > 0 ? value : undefined;
}

export async function deriveToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`finance-tracker::${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
