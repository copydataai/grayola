"use server";

import { DialogProject } from "~/app/_components/DialogProject";
import { ListProjects } from "~/app/_components/ListProjects";
import { Navbar } from "~/app/_components/Navbar";

export default async function DashboardPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center gap-4 pt-4">
        <div className="flex flex-col items-center justify-center gap-4 md:w-1/2 md:flex-row md:justify-between">
          <h3 className="text-3xl font-bold">Projects</h3>
          <DialogProject />
        </div>
        <section className="flex flex-col items-center justify-center gap-4">
          <ListProjects width={150} height={150} aspectRatio="square" />
        </section>
      </main>
    </>
  );
}
