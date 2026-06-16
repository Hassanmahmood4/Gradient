import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ----------------------------------------------------------------------------
   Server-side Supabase client using the service-role key.

   Auth is handled by Clerk, not Supabase, so every database call runs on the
   server with the service role and is scoped to the Clerk `userId` by hand.
   The service-role key must never be exposed to the browser — this module is
   `server-only` to enforce that.
---------------------------------------------------------------------------- */

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }
  cached ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
