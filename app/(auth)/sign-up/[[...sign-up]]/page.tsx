import { ClerkLoaded, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SignUp
        fallbackRedirectUrl="/profile-setup"
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

      <ClerkLoaded>
        <div className="mt-1 text-center w-full">
          <p className="text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <Button
              asChild
              variant="link"
              className="p-px text-[13px]"
              size="sm"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </p>
        </div>
      </ClerkLoaded>
    </div>
  );
}
