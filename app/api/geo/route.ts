import { geolocation } from "@vercel/functions";

export function GET(request: Request) {
  const geo = geolocation(request);

  return new Response(geo.country || "US");
}
