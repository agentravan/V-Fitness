import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines and AI answer engines (GPTBot, OAI-SearchBot, PerplexityBot,
      // Google-Extended, ClaudeBot…) may crawl all public marketing pages.
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
