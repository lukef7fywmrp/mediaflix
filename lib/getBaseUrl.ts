export default function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // In production, VERCEL_URL might be undefined or just the domain
  const vercelUrl = process.env.VERCEL_URL;
  if (!vercelUrl) {
    throw new Error("VERCEL_URL environment variable is not set");
  }

  // Ensure the URL has the https:// protocol
  return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
}
