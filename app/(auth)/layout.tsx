import logo from "@/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import AuthHeroSlideshow from "@/components/AuthHeroSlideshow";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src={logo}
              alt="MediaFlix Logo"
              className="object-contain h-12 w-fit"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <AuthHeroSlideshow />
      </div>
    </div>
  );
}

export default AuthLayout;
