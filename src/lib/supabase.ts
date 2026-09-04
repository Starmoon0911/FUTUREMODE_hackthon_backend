import { createClient } from "@supabase/supabase-js";

import { env } from "../config/env.js";

/**
 * Server-only client for trusted backend operations. Never import this module
 * into browser code or expose SUPABASE_SERVICE_ROLE_KEY to a client.
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL ?? "https://placeholder.supabase.co",
  env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
