import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PingPanda",
  description: "SaaS Realtime to Youir Discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-[calc(100vh-1px)] flex flex-col font-sans bg-white text-black antialiased">
          <main className="relative flex-1 flex flex-col">
            <Providers>{children}</Providers>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
