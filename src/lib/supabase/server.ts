import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

/**
 * Server-only Supabase client built with the service-role key.
 *
 * All finance data access happens through server actions (see each feature's
 * `api/service.ts`), so the service-role key never reaches the browser. The
 * tables have RLS enabled with no public policies; the service role bypasses
 * RLS, which keeps the Data API closed while letting the trusted server read
 * and write.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local'
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return client;
}
