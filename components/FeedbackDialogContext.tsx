"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FeedbackDialogContextType {
  isOpen: boolean;
  openDialog: () => void;
  openDialogFromBanner: () => void;
  closeDialog: () => void;
  setIsOpen: (open: boolean) => void;
  feedbackSubmitted: boolean;
  setFeedbackSubmitted: (submitted: boolean) => void;
  openedFromBanner: boolean;
  setOpenedFromBanner: (fromBanner: boolean) => void;
}

const FeedbackDialogContext = createContext<FeedbackDialogContextType | null>(
  null,
);

export function FeedbackDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [openedFromBanner, setOpenedFromBanner] = useState(false);

  const openDialog = () => {
    setOpenedFromBanner(false);
    setIsOpen(true);
  };

  const openDialogFromBanner = () => {
    setOpenedFromBanner(true);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <FeedbackDialogContext.Provider
      value={{
        isOpen,
        openDialog,
        openDialogFromBanner,
        closeDialog,
        setIsOpen,
        feedbackSubmitted,
        setFeedbackSubmitted,
        openedFromBanner,
        setOpenedFromBanner,
      }}
    >
      {children}
    </FeedbackDialogContext.Provider>
  );
}

export function useFeedbackDialog() {
  const context = useContext(FeedbackDialogContext);
  if (!context) {
    throw new Error(
      "useFeedbackDialog must be used within a FeedbackDialogProvider",
    );
  }
  return context;
}
