"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

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
  title: string;
};

const MAX_FILE_SIZE = 5000000;

const noFileError = new Error("expects a file");
const tooBigFileError = new Error("File size must not exceed 5MB");

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
  const handleFileChange = async ({
    file,
  }: {
    file: File | null | undefined;
  }) => {
    try {
      await setIsLoading(true);
      if (!file) throw noFileError;

      if (file.size > MAX_FILE_SIZE) {
        throw tooBigFileError;
      }
      const fileId = await uuidv4();
      await setFileContent(file);
      await setFileName(fileId + "-" + file.name);
    } catch (err: any) {
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
    const { data = {}, error } = await UploadFile(fileName, fileContent);
    if (error) {
      toast.error(`Error uploading ${fileName}file`);
      form.reset();
      return;
    }
    if (!data) {
      toast.error("Error uploading file");
      form.reset();
      return;
    }

    const newFile = await mutation.mutate({
      path: (data as any).path,
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
          <DialogTitle>{props.title}</DialogTitle>
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
                        if (e.target?.files && e.target.files.length > 0) {
                          handleFileChange({ file: e.target.files[0] });
                        } else {
                          handleFileChange({ file: null });
                        }
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
