"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import type React from "react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
      loaded: (ph) => {
        // Opt out of capturing in development
        if (process.env.NODE_ENV === "development") {
          ph.opt_out_capturing(); // opts out of event capture
          ph.set_config({ disable_session_recording: true });
        }
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
