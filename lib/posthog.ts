import { PostHog } from "posthog-node";

// NOTE: This is a Node.js client for sending events from the server side to PostHog.
export default function PostHogClient() {
  // Skip initialization in development/localhost
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
