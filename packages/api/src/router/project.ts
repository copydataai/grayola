import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { Files, Profile, Project, ProjectUsers, Role } from "@acme/db/schema";
import { CreateProjectSchema } from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

enum Roles {
    Customer = "customer",
    ProjectManager = "project manager",
    Designer = "designer",
    Admin = "admin",
}

export const projectRouter = {
    create: protectedProcedure
        .input(CreateProjectSchema)
        .mutation(async ({ ctx, input }) => {
            const { name, description } = input;
            const profileId = ctx.user.id;
            const project = await ctx.db
                .insert(Project)
                .values({
                    name,
                    description,
                    customerId: profileId,
                })
                .returning();

            const customerRole = await ctx.db
                .select()
                .from(Role)
                .where(eq(Role.name, Roles.Customer));

            const projectUser = await ctx.db.insert(ProjectUsers).values({
                roleId: customerRole[0]!.id,
                projectId: project[0]!.id,
                profileId,
            });

            return project;
        }),
    createFile: protectedProcedure
        .input(z.object({ path: z.string(), projectId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const file = await ctx.db
                .insert(Files)
                .values({ path: input.path, projectId: input.projectId })
                .returning();

            return file;
        }),
    getFilesByProjectId: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            // TODO: check if user has access to project
            const files = await ctx.db
                .select()
                .from(Files)
                .where(eq(Files.projectId, input.projectId));

            return files;
        }),
    listAll: protectedProcedure.query(async ({ ctx }) => {
        const profileId = await ctx.user.id;

        const projects = await ctx.db
            .select(Project)
            .from(ProjectUsers)
            .where(eq(ProjectUsers.profileId, profileId))
            .innerJoin(Project, eq(Project.id, ProjectUsers.projectId));

        return projects;
    }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            // TODO: just project that users belongs
            // TODO: check if user is project manager
            //       if (data?.authorId !== ctx.user.id) {
            // throw new TRPCError({
            //   code: "UNAUTHORIZED",
            //   message: "Only the project manager is allowed to delete the project",
            // });
            // }
        }),
} satisfies TRPCRouterRecord;
