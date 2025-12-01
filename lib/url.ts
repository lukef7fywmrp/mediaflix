import { headers } from "next/headers";

/**
 * Resolve the canonical base URL for the current environment.
 * Precedence:
 * 1) NEXT_PUBLIC_SITE_URL (explicit canonical, includes protocol)
 * 2) VERCEL_PROJECT_PRODUCTION_URL (production domain, add https)
 * 3) VERCEL_URL (current deployment domain, add https)
 * 4) Request headers (proto + host)
 */
export async function getBaseUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit?.startsWith("http")) return explicit.replace(/\/$/, "");

  const projectProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (projectProd) return `https://${projectProd}`.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`.replace(/\/$/, "");

  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const host = hdrs.get("host") ?? "localhost:3000";
  return `${proto}://${host}`.replace(/\/$/, "");
}
