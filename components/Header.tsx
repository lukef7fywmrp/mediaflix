"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/images/logo.svg";
import { cn } from "@/lib/utils";
import UserDropdown from "./UserDropdown";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

function Header() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const lastInteractionRef = React.useRef<HTMLElement | null>(null);
  const isClosingRef = React.useRef(false);

  const handleOpenChange = (open: boolean) => {
    // If trying to close, check if the last interaction was on header (but not menu button or logo)
    if (!open && lastInteractionRef.current) {
      const target = lastInteractionRef.current;
      if (headerRef.current?.contains(target)) {
        const menuButtonArea = target.closest("[data-menu-button-area]");
        const logoLink = target.closest("[data-logo-link]");
        // Allow closing if it's the menu button or logo, otherwise prevent closing
        if (!menuButtonArea && !logoLink) {
          // Don't close - it was a click on header but not menu button or logo
          lastInteractionRef.current = null;
          return;
        }
      }
    }

    lastInteractionRef.current = null;
    setSheetOpen(open);
  };

  // Track all clicks on header elements
  React.useEffect(() => {
    if (!sheetOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (headerRef.current?.contains(target)) {
        lastInteractionRef.current = target;
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, [sheetOpen]);

  // Intercept clicks when sheet is closing to prevent navigation
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isClosingRef.current) {
        const target = e.target as HTMLElement;
        // Don't block header clicks
        if (!headerRef.current?.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
        isClosingRef.current = false;
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        sheetOpen
          ? "bg-background border-b border-transparent"
          : "bg-background/95 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Mobile: Menu Icon (Left) */}
        <div className="flex md:hidden" data-menu-button-area>
          <Sheet open={sheetOpen} onOpenChange={handleOpenChange} modal={false}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 -ml-1.5">
                <Menu className="h-5! w-5!" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              showOverlay={false}
              showCloseButton={false}
              className="top-20 h-[calc(100vh-5rem)]! w-3/4! sm:max-w-sm border-r p-0 bg-background border-0"
              onInteractOutside={(e) => {
                const target = e.target as HTMLElement;
                lastInteractionRef.current = target;

                if (headerRef.current?.contains(target)) {
                  const menuButtonArea = target.closest(
                    "[data-menu-button-area]",
                  );
                  const logoLink = target.closest("[data-logo-link]");
                  // Only allow closing if it's the menu button or logo
                  if (!menuButtonArea && !logoLink) {
                    // Don't close - it was a click on header but not menu button or logo
                    e.preventDefault();
                    return;
                  }
                }
                // For clicks outside header, set the closing flag BEFORE the click propagates
                // This way the global click handler will catch it and prevent navigation
                isClosingRef.current = true;
              }}
              onPointerDownOutside={(e) => {
                const target = e.target as HTMLElement;
                lastInteractionRef.current = target;

                if (headerRef.current?.contains(target)) {
                  const menuButtonArea = target.closest(
                    "[data-menu-button-area]",
                  );
                  const logoLink = target.closest("[data-logo-link]");
                  // Only allow closing if it's the menu button or logo
                  if (!menuButtonArea && !logoLink) {
                    // Don't close - it was a click on header but not menu button or logo
                    e.preventDefault();
                    return;
                  }
                }
                // For clicks outside header, let the sheet close
                // The global click handler will prevent navigation
              }}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col p-3">
                <Link
                  href="/"
                  onClick={() => setSheetOpen(false)}
                  className="text-lg text-foreground/90 font-semibold py-2 px-2 rounded-md hover:bg-accent transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/?type=tv"
                  onClick={() => setSheetOpen(false)}
                  className="text-lg text-foreground/90 font-semibold py-2 px-2 rounded-md hover:bg-accent transition-colors"
                >
                  TV Shows
                </Link>
                <SignedIn>
                  <Link
                    href="/watchlist"
                    onClick={() => setSheetOpen(false)}
                    className="text-lg text-foreground/90 font-semibold py-2 px-2 rounded-md hover:bg-accent transition-colors"
                  >
                    My Watchlist
                  </Link>
                </SignedIn>
                <Link
                  href="/about"
                  onClick={() => setSheetOpen(false)}
                  className="text-lg text-foreground/90 font-semibold py-2 px-2 rounded-md hover:bg-accent transition-colors"
                >
                  About
                </Link>
                <SignedOut>
                  <SignInButton>
                    <button
                      onClick={() => setSheetOpen(false)}
                      className="w-full text-left text-lg font-semibold text-foreground/90 py-2 px-2 rounded-md hover:bg-accent transition-colors"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <div className="pt-4 border-t border-border/50 mt-2">
                  <div className="flex flex-col gap-3 px-2">
                    <Link
                      href="/terms-of-service"
                      onClick={() => setSheetOpen(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="/privacy-policy"
                      onClick={() => setSheetOpen(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* MediaFlix Logo - Centered on mobile, left on desktop */}
        <Link
          href="/"
          onClick={() => setSheetOpen(false)}
          data-logo-link
          className="flex items-center space-x-2 flex-1 justify-center md:flex-initial md:justify-start"
        >
          <Image
            src={logo}
            alt="MediaFlix Logo"
            className="size-24 md:size-28 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Movies
          </Link>
          <Link
            href="/?type=tv"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            TV Shows
          </Link>
          <SignedIn>
            <Link
              href="/watchlist"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Watchlist
            </Link>
          </SignedIn>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        {/* User actions placeholder */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default Header;
