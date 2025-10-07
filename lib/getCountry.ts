import { headers } from "next/headers";

/**
 * Get the user's country code from edge platform geo headers.
 *
 * Supported platforms:
 * - Vercel: x-vercel-ip-country header
 * - Cloudflare: cf-ipcountry header
 * - Other platforms: add support as needed
 *
 * @returns Two-letter country code (defaults to "US" if unavailable)
 */
export default async function getCountry(): Promise<string> {
  try {
    const headersList = await headers();

    // Vercel provides geo headers on all plans
    const vercelCountry = headersList.get("x-vercel-ip-country");
    console.log("Vercel country:", vercelCountry);
    if (vercelCountry && vercelCountry !== "ZZ") {
      console.log("Vercel country:", vercelCountry);
      return vercelCountry;
    }

    // Cloudflare provides geo headers
    const cfCountry = headersList.get("cf-ipcountry");
    console.log("Cloudflare country:", cfCountry);
    if (cfCountry && cfCountry !== "XX") {
      console.log("Cloudflare country:", cfCountry);
      return cfCountry;
    }

    // Default to US if no geo headers available (e.g., local development)
    return "US";
  } catch (error) {
    console.error("Error fetching country from headers:", error);
    return "US";
  }
}
