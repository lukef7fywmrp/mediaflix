import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | MediaFlix",
  description:
    "Review the terms that govern your use of the MediaFlix application.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <article className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Welcome to MediaFlix. These Terms of Service (&quot;Terms&quot;)
              govern your use of the MediaFlix website and applications
              (collectively, the &quot;Service&quot;). By accessing or using the
              Service, you agree to these Terms. If you do not agree, you may
              not use MediaFlix.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Eligibility and Accounts</h2>
            <p className="text-muted-foreground">
              MediaFlix accounts are available worldwide, but you must have the
              legal right to use online services in your jurisdiction. When you
              sign in with Clerk, you are responsible for maintaining the
              confidentiality of your login credentials and for all activities
              under your account. Notify us promptly if you suspect unauthorized
              access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Use of the Service</h2>
            <p className="text-muted-foreground">
              MediaFlix helps you discover popular movies and TV shows and keep
              a personalized watchlist. You agree to use the Service only for
              lawful purposes and in accordance with these Terms. In particular,
              you will not:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Misrepresent your identity or impersonate another person.</li>
              <li>
                Interfere with or disrupt MediaFlix servers, Convex databases,
                or networks connected to the Service.
              </li>
              <li>
                Use automated tools to scrape, index, or otherwise access the
                Service in violation of TMDB, Clerk, or MediaFlix policies.
              </li>
              <li>
                Upload or share content that is unlawful, infringing, or
                harmful.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Content and Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              Media metadata presented in the Service is sourced from TMDB and
              remains the property of TMDB and its licensors. Our trademarks,
              branding, and original interface designs are owned by MediaFlix.
              You may view and interact with the Service for personal,
              non-commercial use. You may not reproduce, distribute, or create
              derivative works from MediaFlix content without permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">User Contributions</h2>
            <p className="text-muted-foreground">
              Any information you submit—such as profile preferences, watchlist
              selections, or feedback—must be accurate and lawful. You grant
              MediaFlix a limited license to store and display this data to
              provide the Service. We may remove content that violates these
              Terms or applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Third-Party Services</h2>
            <p className="text-muted-foreground">
              MediaFlix integrates with third-party services such as Clerk,
              Convex, TMDB, and hosting providers. Your use of those services is
              subject to their own terms and policies. MediaFlix is not
              responsible for third-party content or actions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service if you
              violate these Terms or if we discontinue MediaFlix. You may stop
              using the Service at any time. Upon termination, sections that by
              their nature should survive (including liability, disclaimers, and
              governing law) will remain in effect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Disclaimers</h2>
            <p className="text-muted-foreground">
              MediaFlix is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. We do not guarantee uninterrupted or
              error-free operation, the accuracy of TMDB data, or the
              availability of specific features. To the fullest extent permitted
              by law, we disclaim all warranties, whether express or implied,
              including implied warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the extent permitted by law, MediaFlix and its operators will
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or data
              arising from your use of the Service. Our aggregate liability will
              not exceed the amount you paid us (if any) in the twelve months
              preceding the claim.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of your home jurisdiction. If
              you operate MediaFlix as a registered business, update this
              section to reflect the governing law and venue that apply to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Changes to the Terms</h2>
            <p className="text-muted-foreground">
              We may modify these Terms as MediaFlix evolves. When we do, we
              will communicate the update within the Service when required.
              Continued use of MediaFlix after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms? Email{" "}
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
