import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { SignOutButton } from "@clerk/nextjs";

export const NavBar = () => {
  const user = false;

  return (
    <nav className="sticky z-100 h-16 inset-x-0 top-0 w-full border-b border-grsy-200 bg-white/80 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            Ping<span className="text-blue-700">Panda</span>
          </Link>
          <div className="h-full flex tems-center space-x-4">
            {user ? <>
              <SignOutButton>
                
            </SignOutButton>
            </> : null}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
