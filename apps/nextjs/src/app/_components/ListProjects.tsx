"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/sonner";

import { api } from "~/trpc/react";

export function ListProjects({
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}) {
  const { data, isLoading, isError, error } = api.project.listAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  console.log(data);

  return (
    <div className="flex flex-wrap gap-4">
      {data.map((project) => (
        <Link
          href="/dashboard/project/[projectId]"
          as={`/dashboard/project/${project.id}`}
          key={project.id}
        >
          <div className={cn("space-y-3", className)} {...props}>
            <div className="overflow-hidden rounded-md">
              <Image
                src="/team-collaborating.webp"
                alt={project.name}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
                )}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col space-y-1 text-sm">
                <h3 className="font-medium leading-none">{project.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {project.description}
                </p>
              </div>

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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
