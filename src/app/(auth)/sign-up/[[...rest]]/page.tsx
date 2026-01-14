"use client";

import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-between">
      <SignUp fallbackRedirectUrl="/welcome" forceRedirectUrl="/welcome" />
    </div>
  );
};

export default Page;
