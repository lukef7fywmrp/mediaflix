"use client";

import { Handshake, Megaphone } from "lucide-react";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { useFeedbackDialog } from "./FeedbackDialogContext";

export function FeedbackAnnouncement() {
  const { openDialogFromBanner, feedbackSubmitted } = useFeedbackDialog();

  return (
    <AnnouncementBanner
      id="feedback-feature-v1"
      message={
        feedbackSubmitted
          ? "Thank you for your feedback! We appreciate you helping us improve MediaFlix."
          : "We've added a feedback form! Help us improve MediaFlix by sharing your thoughts"
      }
      actionLabel={feedbackSubmitted ? undefined : "Share Feedback"}
      onAction={feedbackSubmitted ? undefined : openDialogFromBanner}
      icon={
        feedbackSubmitted ? (
          <Handshake className="h-4 w-4 shrink-0" />
        ) : (
          <Megaphone className="h-4 w-4 shrink-0" />
        )
      }
    />
  );
}
