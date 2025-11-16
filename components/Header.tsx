import logo from "@/images/logo.svg";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* MediaFlix Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Play Icon */}
          <Image
            src={logo}
            alt="MediaFlix Logo"
            className="size-24 md:size-28 object-contain dark:invert"
          />
        </Link>

        {/* Navigation placeholder */}
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
