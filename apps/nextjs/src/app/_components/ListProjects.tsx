"use client";

import Image from "next/image";
import { ListMusic, PlusCircle } from "lucide-react";

import { cn } from "@acme/ui";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@acme/ui/context-menu";
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
        <div className={cn("space-y-3", className)} {...props}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/team-collaborating.webp"
                  alt={project.name}
                  width={width}
                  height={height}
                  className={cn(
                    "h-auto w-auto object-cover transition-all hover:scale-105",
                    aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square",
                  )}
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-40">
              <ContextMenuItem>Add to Library</ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Playlist
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuItem>Play Next</ContextMenuItem>
              <ContextMenuItem>Play Later</ContextMenuItem>
              <ContextMenuItem>Create Station</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Like</ContextMenuItem>
              <ContextMenuItem>Share</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <div className="space-y-1 text-sm">
            <h3 className="font-medium leading-none">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
