import { geolocation } from "@vercel/functions";

export function GET(request: Request) {
  const geo = geolocation(request);

  console.log("GEO LOCATION >>>", geo);

  return new Response(geo.country || "US");
}
