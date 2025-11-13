import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Image from "next/image";
import TmdbLogo from "@/images/The Movie Database Logo.png";

function Footer() {
  return (
    <div className="mt-16 py-6 space-y-4 md:space-y-5 text-center text-sm text-muted-foreground container mx-auto px-4">
      <div className="flex flex-col items-center justify-center gap-3">
        <Link
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <Image
            src={TmdbLogo}
            alt="The Movie Database (TMDB)"
            className="h-10 w-auto"
          />
        </Link>
        <p className="max-w-2xl text-xs md:text-sm text-muted-foreground">
          This product uses{" "}
          <Link
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            TMDB
          </Link>{" "}
          and the TMDB APIs but is not endorsed, certified, or otherwise
          approved by TMDB.
        </p>
      </div>

      <Separator />
      <div className="flex items-center justify-center">
        <Button
          asChild
          variant="link"
          className="text-muted-foreground text-xs md:text-sm py-0 h-fit"
        >
          <Link
            href="/privacy-policy"
            className="transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className="text-muted-foreground text-xs md:text-sm py-0 h-fit"
        >
          <Link
            href="/terms-of-service"
            className="transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Footer;
