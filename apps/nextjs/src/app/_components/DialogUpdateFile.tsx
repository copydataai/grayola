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

type DialogUpdateFileProps = {
  fileId: string;
  projectId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MAX_FILE_SIZE = 5000000;

const noFileError = new Error("expects a file");
const tooBigFileError = new Error("File size must not exceed 5MB");

export function DialogUpdateFile(props: DialogUpdateFileProps) {
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { fileId, projectId, isOpen, setIsOpen } = props;

  const mutation = api.project.updateFile.useMutation({
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
      const fileHash = await uuidv4();
      await setFileContent(file);
      await setFileName(fileHash + "-" + file.name);
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
      fileId: fileId,
      projectId: projectId,
      path: (data as any).path,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update File</DialogTitle>
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
