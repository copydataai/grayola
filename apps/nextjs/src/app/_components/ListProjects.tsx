"use client";

import Image from "next/image";
import Link from "next/link";
import { z } from "zod";

import { Roles, SelectProjectAndRoleSchema } from "@acme/db/schema";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/sonner";

import { DialogModifyProject } from "~/app/_components/DialogModifyProject";
import { DropDownOptions } from "~/app/_components/DropDownOptions";
import { api } from "~/trpc/react";

type ListProjectsProps = {
  aspectRatio?: "portrait" | "square";
  width: number;
  height: number;
  className?: string;
};

type ProjectAndRole = z.infer<typeof SelectProjectAndRoleSchema>;

export function ListProjects({
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: ListProjectsProps) {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = api.project.listAllAndRole.useQuery<ProjectAndRole[]>();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex w-1/2 flex-wrap items-center justify-center gap-4 ">
      {data.map((project: ProjectAndRole) => (
        <div className={cn("space-y-3", className)} key={project.id} {...props}>
          <div className="overflow-hidden rounded-md">
            {/* TODO: replace img by the latest uploaded file */}
            <Link
              href="/dashboard/project/[projectId]"
              as={`/dashboard/project/${project.id}`}
            >
              <Image
                src="/team-collaborating.webp"
                alt={project.name ?? "Unnamed project"}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
                )}
              />
            </Link>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col space-y-1 text-sm">
              <h3 className="font-medium leading-none">{project.name}</h3>
              <p className="text-xs text-muted-foreground">
                {project.description}
              </p>
            </div>

            {(project.role === Roles.ProjectManager ||
              project.role === Roles.Admin) && (
              <div className="flex items-center space-x-2">
                <DialogModifyProject
                  projectId={project.id}
                  name={project.name}
                  description={project.description}
                />

                <DropDownOptions projectId={project.id} role={project.role} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
