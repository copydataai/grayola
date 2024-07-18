"use server";

import Link from "next/link";
import { Origami } from "lucide-react";

import { Button } from "@acme/ui/button";

export async function Navbar() {
  return (
    <nav className="flex w-1/2 items-center justify-between gap-4">
      <div>
        <Link href="/">
          <Origami size={28} />
        </Link>
      </div>
      <div>
        <Link href="/auth/login" asChild>
          <Button
            variant="outline"
            className="border-x-1 border-t-1 border-b-4 border-x-black border-b-black border-t-black bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-pink-500 hover:to-yellow-500"
          >
            Getting started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
