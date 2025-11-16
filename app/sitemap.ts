import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/url";

// Using headers makes this route dynamic; acceptable so we can infer the host in all environments.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();
  const lastModified = new Date();

  const routes: Array<MetadataRoute.Sitemap[number]> = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "daily", priority: 1 },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return routes;
}
