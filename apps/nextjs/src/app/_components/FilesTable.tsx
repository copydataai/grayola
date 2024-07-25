"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";

import { Roles } from "@acme/db/schema";
import { Button } from "@acme/ui/button";
import { DataTable } from "@acme/ui/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import { toast } from "@acme/ui/sonner";

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
      const router = useRouter();
      const role = row.original.role;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 hover:bg-muted"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={async () => {
                const { data, error } = await GetSignedURL(row.original.path);
                if (error) {
                  toast.error(error.message);
                }
                if (data) {
                  toast.success("File downloaded");
                  await router.push(data.signedUrl);
                }
              }}
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              view
            </DropdownMenuItem>
            {(role === Roles.ProjectManager || role === Roles.Admin) && (
              <>
                <DropdownMenuItem onSelect={() => console.log("update")}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  update
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => console.log("delete")}
                  className="cursor-pointer text-destructive"
                >
                  <Trash className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
