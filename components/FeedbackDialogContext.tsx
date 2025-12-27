"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const FEEDBACK_SUBMITTED_KEY = "mediaflix-feedback-submitted";

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
  const [feedbackSubmitted, setFeedbackSubmittedState] = useState(false);
  const [openedFromBanner, setOpenedFromBanner] = useState(false);

  // Initialize feedbackSubmitted from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FEEDBACK_SUBMITTED_KEY);
    if (stored === "true") {
      setFeedbackSubmittedState(true);
    }
  }, []);

  // Wrapper to sync feedbackSubmitted to localStorage
  const setFeedbackSubmitted = (submitted: boolean) => {
    setFeedbackSubmittedState(submitted);
    if (submitted) {
      localStorage.setItem(FEEDBACK_SUBMITTED_KEY, "true");
    } else {
      localStorage.removeItem(FEEDBACK_SUBMITTED_KEY);
    }
  };

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
