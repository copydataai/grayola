"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/sonner";
import { Textarea } from "@acme/ui/textarea";
import { CreateProject, CreateProjectSchema } from "@acme/validators";

import { api } from "~/trpc/react";

export function DialogProject() {
  const form = useForm<CreateProject>({
    resolver: zodResolver(CreateProjectSchema),
  });

  const mutation = api.project.create.useMutation({
    onSuccess: (project) => {
      toast.success(`Project ${project[0]!.name} created`);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(values: CreateProject) {
    await mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Davinci" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="A Neo simulation of platon lifting"
                      {...field}
                    />
                  </FormControl>
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
