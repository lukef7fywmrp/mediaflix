import ConvexClientProvider from "@/components/ConvexClientProvider";
import QueryClientProvider from "@/components/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaFlix",
  description: "A modern movie and TV show discovery app",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          dynamic
          localization={{
            signIn: {
              start: {
                titleCombined: "Login to your account",
                subtitleCombined:
                  "Enter your email below to login to your account",
              },
            },
            dividerText: "Or continue with",
            socialButtonsBlockButton: `Login with {{provider|titleize}}`,
          }}
        >
          <ConvexClientProvider>
            <QueryClientProvider>
              {children}
              <Toaster />
            </QueryClientProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
