"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical } from "lucide-react";
import { useForm } from "react-hook-form";

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { toast } from "@acme/ui/sonner";
import { Textarea } from "@acme/ui/textarea";
import { CreateProjectUsers, CreateProjectUsersSchema } from "@acme/validators";

import { api } from "~/trpc/react";

type DropdownOptions = {
  projectId: string;
  role: Roles;
};

export function DropDownOptions(props: DropdownOptions) {
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);

  const { projectId, role } = props;
  const form = useForm<CreateProjectUsers>({
    resolver: zodResolver(CreateProjectUsersSchema),
    defaultValues: {
      projectId: projectId,
    },
  });

  const mutation = api.project.assignProject.useMutation({
    onSuccess: (project) => {
      toast.success(`User added`);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = api.project.delete.useMutation({
    onSuccess: (project) => {
      toast.info(`Project ${project[0]!.name} deleted`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const roles = api.project.listRoles.useQuery();
  const profiles = api.project.listAllProfiles.useQuery();

  if (roles.isLoading || profiles.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12" />
      </div>
    );
  }

  if (roles.isError || profiles.isError) {
    toast.error("Error fetching data");
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12 text-red-500" />
      </div>
    );
  }

  async function onSubmit(values: CreateProjectUsers) {
    await mutation.mutate(values);
    await setIsAssignOpen(false);
  }

  async function handleDelete() {
    await deleteMutation.mutate({ projectId: projectId });
    await setIsDeleteOpen(false);
  }

  return (
    <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 hover:bg-muted"
            >
              <MoreVertical className="h-3.5 w-3.5" />{" "}
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger onClick={() => setIsDropDownOpen(false)} asChild>
              <DropdownMenuItem>Assign</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <AlertDialogTrigger
              onClick={() => setIsDropDownOpen(false)}
              asChild
            >
              <DropdownMenuItem className="cursor-pointer text-destructive">
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.data?.map((role) => (
                          <SelectItem value={role.id} key={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select the user email" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profiles.data?.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="sm:justify-start">
                <Button variant="outline" type="submit" className="">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
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
    </Dialog>
  );
}
