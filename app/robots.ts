import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

// Using headers makes this route dynamic; acceptable so we can infer the host in all environments.
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
