import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { Toaster } from "@acme/ui/sonner";
import { ThemeProvider, ThemeToggle } from "@acme/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "./_components/Navbar";

import "~/app/globals.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://grayola-theta.vercel.app"
      : "http://localhost:3000",
  ),
  title: "Grayola",
  description: "Design as a Service, quick releases",
  icons: [{ rel: "icon", url: "/origami.svg" }],
  openGraph: {
    title: "Grayola",
    description: "dashboard for a plataform to manage design as a service",
    url: "https://github.com/copydataai/grayola",
    siteName: "Grayola Design as a Service",
  },
  twitter: {
    card: "summary_large_image",
    site: "@copydataaireal",
    creator: "@copydataaireal",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <header className="flex h-12 w-full items-center justify-center px-4">
              <Navbar />
            </header>
            {props.children}
          </TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
