import { headers } from "next/headers";

export default async function getCountry() {
  try {
    const headersList = await headers();

    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");

    let ip: string | null = null;

    if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else if (realIp) {
      ip = realIp.trim();
    }

    if (ip) {
      const req = await fetch(`http://ip-api.com/json/${ip}`);
      const geo = await req.json();
      if (geo.status === "fail") {
        return "US";
      }
      return geo.countryCode;
    }

    return "US";
  } catch (error) {
    console.error("Error fetching country:", error);
    return "US";
  }
}
