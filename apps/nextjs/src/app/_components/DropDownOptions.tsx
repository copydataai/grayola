"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical } from "lucide-react";
import { useForm } from "react-hook-form";

import { Roles } from "@acme/db/schema";
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
  const { projectId, role } = props;
  if (role === Roles.Customer || role === Roles.Designer) {
    return <div></div>;
  }

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
    toast.error(error.message);
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderCircleLucide className="h-12 w-12 text-red-500" />
      </div>
    );
  }

  async function onSubmit(values: CreateProjectUsers) {
    await mutation.mutate(values);
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 hover:bg-muted"
          >
            <MoreVertical className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>Assign</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive">
            Delete
          </DropdownMenuItem>
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
                      <SelectTrigger className="w-[280px]">
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
                      <SelectTrigger className="w-[280px]">
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
              <DialogClose asChild>
                <Button variant="outline" type="submit" className="">
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
