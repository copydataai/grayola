"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";

import { Roles } from "@acme/db/schema";
import { Button } from "@acme/ui/button";
import { DataTable } from "@acme/ui/data-table";
import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import { toast } from "@acme/ui/sonner";

import { DropDownFile } from "~/app/_components/DropDownFile";
import { GetSignedURL } from "~/app/dashboard/project/[projectId]/actions";
import { api } from "~/trpc/react";

const { useRouter } = require("next/navigation");

type Files = {
  id: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  role: Roles;
};

export const columns: ColumnDef<Files>[] = [
  {
    accessorKey: "path",
    header: "File name",
  },
  {
    header: "Created At",
    accessorFn: ({ createdAt }) => {
      return new Date(createdAt).toDateString();
    },
  },
  {
    header: "Updated at",
    accessorFn: ({ updatedAt }) => {
      return new Date(updatedAt).toDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropDownFile
          fileId={row.original.id}
          projectId={row.original.projectId}
          role={row.original.role}
          path={row.original.path}
          createdAt={row.original.createdAt}
          updatedAt={row.original.updatedAt}
        />
      );
    },
  },
];

type FileTableProps = {
  projectId: number;
  role: Roles;
};

export function FilesTable(props: FileTableProps) {
  const { data, isLoading } = api.project.getFilesByProjectId.useQuery({
    projectId: props.projectId,
  });

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12 text-red-500" />
      </div>
    );

  const dataAndRole = data.map((data) => ({ ...data, role: props.role }));

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 px-4 py-4 md:w-1/2">
      <DataTable data={dataAndRole} columns={columns} />
    </section>
  );
}
