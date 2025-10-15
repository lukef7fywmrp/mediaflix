import { SignInButton } from "@clerk/nextjs";
import { Play } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* MediaFlix Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Play Icon */}
          <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 border border-primary/20">
            <Play className="size-3.5 text-primary fill-current" />
          </div>

          <div className="">
            <span className="text-xl font-bold text-primary">Media</span>
            <span className="text-xl font-bold text-foreground">Flix</span>
          </div>
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
          {/* <Link
              href="/my-list"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
            My List
          </Link> */}
        </nav>

        {/* User actions placeholder */}
        <div className="flex items-center space-x-4">
          <SignInButton>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </header>
  );
}

export default Header;
