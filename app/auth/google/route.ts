import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** starts the real google sign-up flow via supabase auth */
export async function GET(request: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.redirect(new URL("/?google=unconfigured", request.url));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${request.nextUrl.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error || !data.url) {
      return NextResponse.redirect(new URL("/?google=error", request.url));
    }
    return NextResponse.redirect(data.url);
  } catch (err) {
    console.error("[auth] google sign-in failed:", err);
    return NextResponse.redirect(new URL("/?google=error", request.url));
  }
}
