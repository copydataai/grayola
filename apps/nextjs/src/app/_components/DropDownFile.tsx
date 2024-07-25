"use client";

import { useState } from "react";
import { Eye, MoreVertical, Pencil, Trash } from "lucide-react";

import { Roles } from "@acme/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@acme/ui/alert-dialog";
import { Button } from "@acme/ui/button";
import { DataTable } from "@acme/ui/data-table";
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

import { DialogUpdateFile } from "~/app/_components/DialogUpdateFile";
import { GetSignedURL } from "~/app/dashboard/project/[projectId]/actions";
import { api } from "~/trpc/react";

const { useRouter } = require("next/navigation");

type Files = {
  fileId: string;
  projectId: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  role: Roles;
};

export function DropDownFile(props: Files) {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const { fileId, path, projectId, createdAt, updatedAt, role } = props;
  const router = useRouter();

  const deleteMutation = api.project.deleteFile.useMutation({
    onSuccess: (file) => {
      toast.info(`Project ${file[0]!.path} deleted`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function handleDelete() {
    await deleteMutation.mutate({ projectId: projectId, fileId: fileId });
    await setIsDeleteOpen(false);
  }
  return (
    <>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
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
              const { data, error } = await GetSignedURL(path);
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
              <DropdownMenuItem
                onSelect={() => {
                  setIsDropDownOpen(false);
                  setIsDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                update
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setIsDropDownOpen(false);
                  setIsDeleteOpen(true);
                }}
                className="cursor-pointer text-destructive"
              >
                <Trash className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogUpdateFile
        fileId={fileId}
        projectId={projectId}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              project info from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
