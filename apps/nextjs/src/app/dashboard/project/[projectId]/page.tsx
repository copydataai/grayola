"use client";

import { LoaderCircleLucide } from "@acme/ui/loader-circle";

import { DialogFile } from "~/app/_components/DialogFile";
import { api } from "~/trpc/react";

export default function ProjectIdPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;
  const { data, isLoading, isError, error } =
    api.project.getFilesByProjectId.useQuery({
      projectId,
    });
  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide />
      </div>
    );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <main className="flex flex-col items-center justify-center gap-4 pt-4">
      <div>
        <DialogFile projectId={projectId} />
      </div>
      <section>
        {data.length === 0 ? (
          <div>No files found</div>
        ) : (
          data.map((file) => <p key={file.id}>{file.path}</p>)
        )}
      </section>
    </main>
  );
}
