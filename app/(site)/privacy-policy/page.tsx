import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MediaFlix",
  description:
    "Understand how MediaFlix collects, uses, and safeguards your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <article className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              MediaFlix helps you discover trending movies and TV shows powered
              by The Movie Database (TMDB). This policy explains what
              information we collect, how we use it, and the rights you have
              regarding your personal information.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect the following categories of information when you use
              MediaFlix:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">
                  Account information:
                </span>{" "}
                Authentication and profile details provided through Clerk, such
                as your name, email address, username, and profile image.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Profile preferences:
                </span>{" "}
                Optional details you add in the profile setup flow, including
                favorite genres, preferred languages, notification settings,
                birth date, and country.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Watchlist data:
                </span>{" "}
                Items you add to or remove from your watchlist, along with
                associated metadata (title, TMDB identifier, poster, release
                date, and ratings).
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Usage information:
                </span>{" "}
                Basic analytics and diagnostic data collected automatically by
                our hosting providers (such as Vercel) to secure and improve the
                service.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">How We Use Information</h2>
            <p className="text-muted-foreground">We use your information to:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Authenticate you and secure access to protected areas.</li>
              <li>
                Personalize your experience, including storing your watchlist
                and media preferences.
              </li>
              <li>
                Improve site performance, enhance features, and fix bugs based
                on aggregate usage patterns.
              </li>
              <li>
                Communicate with you about updates or respond to support
                requests (if you contact us).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Third-Party Services</h2>
            <p className="text-muted-foreground">
              MediaFlix relies on trusted third parties to deliver core
              functionality:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Clerk</span> for
                authentication and account management.
              </li>
              <li>
                <span className="font-medium text-foreground">Convex</span> for
                secure storage of your profile preferences and watchlist data.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  The Movie Database (TMDB)
                </span>{" "}
                APIs to fetch media metadata, subject to the TMDB Terms of Use.
              </li>
              <li>
                <span className="font-medium text-foreground">Vercel</span> (or
                equivalent hosting providers) for application hosting and
                logging.
              </li>
            </ul>
            <p className="text-muted-foreground">
              These providers may process your information under their own
              privacy policies. We only share the minimum necessary data needed
              for MediaFlix to function.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your profile and watchlist data for as long as your
              MediaFlix account remains active. You can update or delete your
              watchlist at any time within the app. If you close your account
              through Clerk or request deletion, we will remove associated data
              from Convex within a reasonable timeframe.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p className="text-muted-foreground">
              Depending on where you live, you may have the right to access,
              correct, download, or delete your personal data. To exercise these
              rights:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Manage your profile details and preferences directly in the
                MediaFlix profile settings.
              </li>
              <li>
                Contact us using the details below for additional data requests
                or questions.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Changes to this Policy</h2>
            <p className="text-muted-foreground">
              We may update this policy to reflect changes to MediaFlix or legal
              requirements. When we make material updates, we will note the
              change within the app and provide additional notice when required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions or requests related to privacy, email us at{" "}
              <a
                href="mailto:stevef7fywmrp@gmail.com"
                className="font-medium text-primary underline underline-offset-4"
              >
                stevef7fywmrp@gmail.com
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
