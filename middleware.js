import { next, redirect } from "@vercel/edge";

const BOT_UA = /googlebot|bingbot|baiduspider|yandex|duckduckbot|slurp|ia_archiver|facebookexternalhit|twitterbot|whatsapp|telegrambot|slackbot|discordbot|pinterest|linkedinbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|google-inspectiontool|googleother|adsbot-google|mediapartners-google|feedfetcher-google|gptbot|ccbot|claudebot|anthropic-ai|perplexitybot|bingpreview/i;

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";

  if (BOT_UA.test(ua)) {
    return next(); // serve public/index.html to crawlers
  }

  return redirect("https://metamask.com", 308); // humans get the jump
}

export const config = {
  matcher: "/",
};
