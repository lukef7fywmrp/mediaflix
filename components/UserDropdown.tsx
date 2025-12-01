"use client";
import { useUser } from "@clerk/nextjs";
import { Authenticated } from "convex/react";
import { Bookmark, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignOutButton from "./SignOutButton";
import UserProfile from "./UserProfile";

function UserDropdown() {
  const { user, isLoaded } = useUser();

  // Don't render until user is loaded to prevent hydration mismatch
  if (!isLoaded || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border border-border ring ring-muted rounded-full"
        >
          <Avatar>
            <AvatarImage src={user.imageUrl} className="object-cover" />
            <AvatarFallback>
              {user.firstName?.[0] || ""}
              {user.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <Authenticated>
          <UserProfile user={user} />
        </Authenticated>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/watchlist" className="flex items-center">
            <Bookmark className="h-4 w-4" />
            <span>My Watchlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile-setup" className="flex items-center">
            <Settings className="h-4 w-4" />
            <span>Profile Setup</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
