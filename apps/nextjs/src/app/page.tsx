"use server";

import Link from "next/link";

import { Button } from "@acme/ui/button";

import { api } from "~/trpc/server";

export default async function HomePage() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <main className="container flex h-screen flex-col items-center justify-center space-x-8 from-sky-500 to-emerald-500 py-16 md:flex-row">
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="inline bg-gradient-to-b from-emerald-500 to-sky-500 bg-clip-text text-[2.5rem] font-semibold tracking-tight text-transparent lg:text-5xl">
          Grayola
        </h1>
        <div className="">
          <h2 className="text-xl font-bold text-sky-500 underline decoration-sky-500">
            Your Design as a Service
          </h2>
          <h3 className="font-semibold text-emerald-600">
            Get designs at least of 72 hours
          </h3>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="border-x-1 border-t-1 animate-pulse border-b-4 border-x-black border-b-black border-t-black bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-pink-500 hover:to-yellow-500 hover:delay-1000 "
          asChild
        >
          <Link href="/auth/signup">Free Trial</Link>
        </Button>
      </div>
      <div>
        <img
          className="size-64 w-64 rounded-lg shadow-2xl"
          src="/team-collaborating.webp"
          alt="a full team working for you"
        />
      </div>
    </main>
  );
}
