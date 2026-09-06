import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * supabase session refresh middleware.
 *
 * without this, a token refresh triggered inside a server component rotates
 * the single-use refresh token but can't persist the new cookie (RSC context)
 * — so the *next* navigation presents a stale token and the session dies
 * (the "click profile twice → signed out" bug). middleware CAN set response
 * cookies, so the rotated session survives every navigation.
 */
export default async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // fast path — no supabase configured, or this visitor has no supabase
  // auth cookie at all (the vast majority of traffic). nothing to refresh,
  // so skip creating the client and skip the network round-trip entirely.
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));
  if (!url || !key || !hasSupabaseCookie) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // important: touch getUser() so an expired access token gets refreshed here,
  // where the rotated cookies can actually be written to the response
  try {
    await supabase.auth.getUser();
  } catch {
    /* network/auth hiccup — pages degrade to the signed-out state gracefully */
  }

  return response;
}

export const config = {
  matcher: [
    // run everywhere except static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)",
  ],
};