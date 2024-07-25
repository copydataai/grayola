"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";

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
            <DropdownMenuItem onSelect={() => console.log("update")}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              update
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <Trash className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function FilesTable({ projectId }) {
  const { data, isLoading } = api.project.getFilesByProjectId.useQuery({
    projectId,
  });

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12 text-red-500" />
      </div>
    );

  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 px-4 py-4 md:w-1/2">
      <DataTable data={data} columns={columns} />
    </section>
  );
}
