"use client";

import { Roles } from "@acme/db/schema";
import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import { ScrollArea } from "@acme/ui/scroll-area";
import { toast } from "@acme/ui/sonner";

import { DialogFile } from "~/app/_components/DialogFile";
import { DialogModifyProject } from "~/app/_components/DialogModifyProject";
import { FilesTable } from "~/app/_components/FilesTable";
import { api } from "~/trpc/react";

export default function ProjectIdPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = api.project.getProjectAndRoleByProjectId.useQuery({
    projectId,
  });

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12" />
      </div>
    );

  if (isError) {
    toast.error(error.message);
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12 text-red-500" />
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-4 py-4">
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="flex w-1/3 flex-col items-center justify-center">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-bold">{data?.name}</h1>

            {(data?.role === Roles.ProjectManager ||
              data?.role === Roles.Admin) && (
              <div className="flex items-center">
                <DialogModifyProject
                  projectId={data?.id}
                  name={data?.name}
                  description={data?.description}
                />
              </div>
            )}
          </div>
          <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            {data?.description}
          </ScrollArea>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          {(data?.role === Roles.ProjectManager ||
            data?.role === Roles.Admin) && <DialogFile projectId={projectId} />}
          <FilesTable projectId={projectId} role={data?.role} />
        </div>
      </section>
    </main>
  );
}
