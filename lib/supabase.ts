import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * supabase auth powers the real "continue with google" sign-up.
 * enable the google provider in supabase dashboard → authentication → providers
 * (exact steps in README). until the env vars below are set, the button is
 * hidden and email signup keeps working.
 */

export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* called from a server component — middleware-free setup tolerates this */
          }
        },
      },
    },
  );
}
