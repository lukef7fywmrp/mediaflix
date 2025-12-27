"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DonateDialogContextType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsOpen: (open: boolean) => void;
}

const DonateDialogContext = createContext<DonateDialogContextType | null>(null);

export function DonateDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <DonateDialogContext.Provider
      value={{ isOpen, openDialog, closeDialog, setIsOpen }}
    >
      {children}
    </DonateDialogContext.Provider>
  );
}

export function useDonateDialog() {
  const context = useContext(DonateDialogContext);
  if (!context) {
    throw new Error(
      "useDonateDialog must be used within a DonateDialogProvider",
    );
  }
  return context;
}
