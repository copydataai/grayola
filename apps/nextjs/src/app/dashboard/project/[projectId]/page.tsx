"use client";

import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import { toast } from "@acme/ui/sonner";

import { DialogFile } from "~/app/_components/DialogFile";
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
  } = api.project.getFilesByProjectId.useQuery({
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

  // TODO: add table to show and filter by created_at, updatedAt
  return (
    <main className="flex flex-col items-center justify-center gap-4 pt-4">
      <div>
        <DialogFile projectId={projectId} />
      </div>
      <section className="flex flex-col items-center justify-center gap-4">
        {data.length === 0 ? (
          <div>No files found</div>
        ) : (
          data.map((file) => <p key={file.id}>{file.path}</p>)
        )}
      </section>
    </main>
  );
}
