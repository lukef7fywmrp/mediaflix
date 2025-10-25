import { Button } from "@/components/ui/button";
import { ClerkLoaded, SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            cardBox: {
              boxShadow: "none",
              backgroundColor: "transparent",
            },
            card: {
              boxShadow: "none",
              backgroundColor: "transparent",
              paddingBottom: "5px",
            },
            headerTitle: {
              fontSize: "22px",
              fontWeight: "bold",
            },
            headerSubtitle: {
              fontSize: "14px",
            },
            footerAction: {
              display: "none",
            },
            footer: {
              display: "none",
            },
          },
          layout: {
            logoPlacement: "none",
            socialButtonsVariant: "blockButton",
            socialButtonsPlacement: "bottom",
          },
        }}
      />

      {/* Sign up link */}
      <ClerkLoaded>
        <div className="mt-1 text-center w-full">
          <p className="text-[13px] text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button
              asChild
              variant="link"
              className="p-px text-[13px]"
              size="sm"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </p>
        </div>
      </ClerkLoaded>
    </div>
  );
}
