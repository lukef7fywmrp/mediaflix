import {
  Circle,
  Code2,
  Heart,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBackdropUrl } from "@/lib/utils";

export const metadata = {
  title: "About",
  description:
    "About this project, the creator, why it exists, and how Popular is defined.",
};

// Using a popular movie backdrop for the hero banner (landscape/widescreen format)
const HERO_BACKDROP_PATH = "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg"; // Landscape movie backdrop

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative w-full aspect-video max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] 2xl:max-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(HERO_BACKDROP_PATH)}
            alt="MediaFlix"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              About MediaFlix
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
              A personal project curated to help you quickly explore movies and
              TV shows with clean, useful detail pages and handy links to watch
              providers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
          <section className="space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <Link
                href="https://www.youtube.com/@alicodes22"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                <Image
                  src="https://yt3.googleusercontent.com/WDaeYEgZDr_8Lk1YZpMHOET0A7dRLVBAeCG14lbsZk6bxqZl6OTpfqoVUnFZA9LAz3aKbwrxdRU=s160-c-k-c0x00ffffff-no-rj"
                  alt="Ali Codes logo"
                  width={80}
                  height={80}
                  className="rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ring-2 ring-border"
                />
              </Link>
              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                <div>
                  <h3 className="font-semibold mb-1">
                    <span className="text-muted-foreground font-normal">
                      Built by{" "}
                    </span>{" "}
                    <Link
                      href="https://www.linkedin.com/in/ali-mehdi-9266a7214/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4 transition-all"
                    >
                      Ali Codes
                    </Link>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    I'm a developer who loves movies and TV shows, and I wanted
                    to create a better way to explore and discover content. This
                    project combines my interests in building clean, useful web
                    experiences with my passion for entertainment.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="https://www.youtube.com/@alicodes22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-sm"
                    aria-label="YouTube"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>YouTube</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/ali-mehdi-9266a7214/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-sm"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-1 group">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Rocket className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-primary/70 transition-colors group-hover:text-primary flex-shrink-0" />
              Why it was created and where it's going
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7">
              I built MediaFlix because I kept{" "}
              <strong className="font-bold">
                spending more time deciding what to watch than actually watching
                something
              </strong>
              . It's designed to be{" "}
              <strong className="font-bold">
                lightweight, minimal, and distraction-free
              </strong>
              , built as a fun learning experience. It's{" "}
              <strong className="font-bold">
                not meant to replace TMDB or IMDb
              </strong>
              , but rather to provide a cleaner, faster way to discover and
              track what you want to watch.
            </p>
          </section>

          <section className="space-y-1 group">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Sparkles className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-primary/70 transition-colors group-hover:text-primary flex-shrink-0" />
              Upcoming Features
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7 mb-2">
              This is <strong className="font-bold">v1</strong> of the platform.
              In <strong className="font-bold">v2</strong>, we're planning to
              add:
            </p>
            <ul className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7 space-y-1">
              <li className="flex items-start gap-2.5">
                <Circle className="w-1.5 h-1.5 text-primary mt-2 fill-primary flex-shrink-0" />
                <span>
                  AI-powered recommendations based on your viewing preferences
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Circle className="w-1.5 h-1.5 text-primary mt-2 fill-primary flex-shrink-0" />
                <span>Create and manage custom collections</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Circle className="w-1.5 h-1.5 text-primary mt-2 fill-primary flex-shrink-0" />
                <span>Share your profile and public collections</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Circle className="w-1.5 h-1.5 text-primary mt-2 fill-primary flex-shrink-0" />
                <span>
                  Discover all movies and shows by specific directors and actors
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Circle className="w-1.5 h-1.5 text-primary mt-2 fill-primary flex-shrink-0" />
                <span>Add reactions and engage with content</span>
              </li>
            </ul>
          </section>

          <section className="space-y-1 group">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-primary/70 transition-colors group-hover:text-primary flex-shrink-0" />
              What "most popular" means
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7">
              Popularity is a lifetime score calculated by TMDB based on
              multiple factors including daily votes, views, favorites,
              watchlists, release dates, total votes, and historical
              performance. Unlike trending (which focuses on daily or weekly
              windows), popularity reflects the overall lifetime engagement and
              appeal of a title. The score is updated daily and helps surface
              content that has consistently resonated with audiences over time.
            </p>
          </section>

          <section className="space-y-1 group">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Code2 className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-primary/70 transition-colors group-hover:text-primary flex-shrink-0" />
              Open Source
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7">
              MediaFlix is an open source project licensed under the MIT
              License. Contributions are welcome! <br /> Check out the code on{" "}
              <Link
                href="https://github.com/lukef7fywmrp/mediaflix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:no-underline transition-all"
              >
                GitHub
              </Link>
              .
            </p>
          </section>

          <section className="space-y-1 group">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Heart className="hidden sm:block w-4 h-4 sm:w-5 sm:h-5 text-primary/70 transition-colors group-hover:text-primary flex-shrink-0" />
              Credits
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm pl-0 sm:pl-7">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
              <br />
              Watch provider data is powered by JustWatch.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
