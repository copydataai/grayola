import type { TRPCRouterRecord } from "@trpc/server";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
    Files,
    Profile,
    Project,
    ProjectUsers,
    Role,
    Roles,
} from "@acme/db/schema";
import { CreateProjectSchema } from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

const getRole = async (
    db: PostgresJsDatabase,
    projectId: string,
    profileId: string,
) => {
    const project = await db
        .select()
        .from(ProjectUsers)
        .where(
            and(
                eq(ProjectUsers.projectId, projectId),
                eq(ProjectUsers.profileId, profileId),
            ),
        );

    if (project.length === 0) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
        });
    }
    const role = await db
        .select()
        .from(Role)
        .where(eq(Role.id, project[0]!.roleId));

    return role[0]!;
};

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

    listAllProfiles: protectedProcedure.query(async ({ ctx, input }) => {
        // TODO: add a role identification
        const profiles = await ctx.db.select().from(Profile);
        return profiles;
    }),
    listRoles: protectedProcedure.query(async ({ ctx, input }) => {
        const roles = await ctx.db.select().from(Role);
        return roles;
    }),

    assignProject: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                roleId: z.string(),
                profileId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);

            if (role.name === Roles.Customer || role.name === Roles.Designer) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only project manager can assign roles",
                });
            }

            const assign = await ctx.db
                .insert(ProjectUsers)
                .values({
                    roleId: input.roleId,
                    projectId: input.projectId,
                    profileId: input.profileId,
                })
                .returning();

            return assign;
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
    getRoleByProjectId: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);
            return role;
        }),
    getProjectAndRoleByProjectId: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .query(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);

            const project = await ctx.db
                .select({
                    id: Project.id,
                    name: Project.name,
                    description: Project.description,
                    customerId: Project.customerId,
                    createdAt: Project.createdAt,
                    updatedAt: Project.updatedAt,
                })
                .from(Project)
                .where(eq(Project.id, input.projectId));

            return { ...project[0], ...{ role: role.name } };
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
            .select({
                id: Project.id,
                name: Project.name,
                description: Project.description,
                customerId: Project.customerId,
                createdAt: Project.createdAt,
                updatedAt: Project.updatedAt,
            })
            .from(ProjectUsers)
            .where(eq(ProjectUsers.profileId, profileId))
            .innerJoin(Project, eq(Project.id, ProjectUsers.projectId));

        return projects;
    }),
    listAllAndRole: protectedProcedure.query(async ({ ctx }) => {
        const profileId = await ctx.user.id;

        const projects = await ctx.db
            .select({
                id: Project.id,
                name: Project.name,
                description: Project.description,
                customerId: Project.customerId,
                createdAt: Project.createdAt,
                updatedAt: Project.updatedAt,
                role: Role.name,
            })
            .from(ProjectUsers)
            .where(eq(ProjectUsers.profileId, profileId))
            .innerJoin(Project, eq(Project.id, ProjectUsers.projectId))
            .innerJoin(Role, eq(Role.id, ProjectUsers.roleId));

        return projects;
    }),
    update: protectedProcedure
        .input(
            z.object({
                projectId: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);
            if (role.name !== Roles.ProjectManager) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:
                        "Only the project manager is allowed to update the project",
                });
            }

            const project = await ctx.db
                .update(Project)
                .set({
                    name: input.name,
                    description: input.description,
                })
                .where(eq(Project.id, input.projectId))
                .returning();

            return project;
        }),
    updateFile: protectedProcedure
        .input(
            z.object({
                fileId: z.string(),
                projectId: z.string(),
                path: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);
            if (role.name !== Roles.ProjectManager) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:
                        "Only the project manager is allowed to update the file",
                });
            }

            const file = await ctx.db
                .update(Files)
                .set({ path: input.path })
                .where(eq(Files.id, input.fileId))
                .returning();

            return file;
        }),
    deleteFile: protectedProcedure
        .input(z.object({ fileId: z.string(), projectId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);
            if (role.name !== Roles.ProjectManager) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:
                        "Only the project manager is allowed to delete the file",
                });
            }

            const file = await ctx.db
                .delete(Files)
                .where(eq(Files.id, input.fileId))
                .returning();

            return file;
        }),
    delete: protectedProcedure
        .input(z.object({ projectId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const role = await getRole(ctx.db, input.projectId, ctx.user.id);
            if (role.name !== Roles.ProjectManager) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:
                        "Only the project manager is allowed to delete the project",
                });
            }

            const project = await ctx.db
                .delete(Project)
                .where(eq(Project.id, input.projectId))
                .returning();

            return project;
        }),
} satisfies TRPCRouterRecord;
