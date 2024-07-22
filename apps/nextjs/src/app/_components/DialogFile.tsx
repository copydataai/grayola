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
import { CreateFile, CreateFileSchema } from "@acme/validators";

import { UploadFile } from "~/app/dashboard/project/[projectId]/actions";
import { api } from "~/trpc/react";

type DialogFileProps = {
  projectId: string;
};

export function DialogFile(props: DialogFileProps) {
  const mutation = api.project.createFile.useMutation({
    onSuccess: () => {
      toast.success("File uploaded");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    schema: CreateFileSchema,
  });
  const handleFileChange = async ({ file }: { file: File | null }) => {
    try {
      if (!file) throw new Error("Function: handleFileChange expects a file");

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must not exceed 2MB");
      }
      await setFileContent(file);
      await setFileName(file.name);
    } catch (err) {
      toast.error(err);
    }
  };

  async function onSubmit(values: CreateFile) {
    const { data, error } = await UploadFile(fileName, fileContent);
    if (error) toast.error(error);
    const newFile = await mutation.mutate({
      path: data.fullPath,
      projectId: props.projectId,
    });
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
