"use client";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Settings, Bookmark } from "lucide-react";
import SignOutButton from "./SignOutButton";
import { useProfile } from "@/hooks/useProfile";
import { Authenticated } from "convex/react";

function UserDropdown() {
  const { user, isLoaded } = useUser();
  const { profile } = useProfile();

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
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="text-sm font-medium">
                {profile?.username?.toLowerCase() ||
                  (user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || "User")}
              </p>
              {user.emailAddresses?.[0]?.emailAddress && (
                <p className="w-[200px] truncate text-xs text-muted-foreground">
                  {user.emailAddresses[0].emailAddress}
                </p>
              )}
            </div>
          </div>
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
