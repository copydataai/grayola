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
import { LoaderCircleLucide } from "@acme/ui/loader-circle";
import { toast } from "@acme/ui/sonner";
import { Textarea } from "@acme/ui/textarea";
import { CreateFile, CreateFileSchema } from "@acme/validators";

import { UploadFile } from "~/app/dashboard/project/[projectId]/actions";
import { api } from "~/trpc/react";

type DialogFileProps = {
  projectId: string;
};

const MAX_FILE_SIZE = 5000000;

export function DialogFile(props: DialogFileProps) {
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const mutation = api.project.createFile.useMutation({
    onSuccess: () => {
      toast.success("File uploaded");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  // TODO: add validation by zod
  const form = useForm({});
  const handleFileChange = async ({ file }: { file: File | null }) => {
    try {
      await setIsLoading(true);
      if (!file) throw new Error("Function: handleFileChange expects a file");

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size must not exceed 5MB");
      }
      await setFileContent(file);
      await setFileName(file.name);
    } catch (err: Error) {
      toast.error(err);
    }
    await setIsLoading(false);
  };

  async function onSubmit() {
    if (fileContent === null) {
      toast.error("Please select a file");
      form.reset();
      return;
    }
    const { data, error } = await UploadFile(fileName, fileContent);
    if (error) toast.error(`Error uploading ${fileName}file`);
    const newFile = await mutation.mutate({
      path: data.fullPath,
      projectId: props.projectId,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        handleFileChange({ file: e.target?.files[0] });
                      }}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-start">
              <Button
                variant="outline"
                type="submit"
                disabled={isLoading}
                className="bg-emerald-500"
              >
                {isLoading && <LoaderCircleLucide className="mr-2 h-4 w-4" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
