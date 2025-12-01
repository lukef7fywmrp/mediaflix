"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function SignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      className="text-red-600 focus:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
