"use client";

import { useState } from "react";
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

import { UploadFile } from "~/app/dashboard/project/[projectId]/actions";
import { api } from "~/trpc/react";

export function DialogFile() {
  const [file, setFile] = useState<File | null>(null);
  const form = useForm({});
  const handleFileChange = async ({ file }: { file: File | null }) => {
    try {
      if (!file) throw new Error("Function: handleFileChange expects a file");

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must not exceed 2MB");
      }

      const { data, error } = await UploadFile(file.name, file);
      console.log("FIle url: ", data, error);
      if (error) throw new Error(error.message);
      if (!data) throw new Error("File not uploaded");
    } catch (err) {
      console.error("Error in handleFileChange:", err);
    }
  };
  async function onSubmit(data: any) {
    console.log("submit", data);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add files</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        console.log(
                          "EVENT",
                          e.target?.files[0],
                          e.target.files,
                        );
                        handleFileChange({ file: e.target?.files[0]! });
                      }}
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
