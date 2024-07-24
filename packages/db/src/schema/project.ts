import { relations, sql } from "drizzle-orm";
import {
    primaryKey,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Profile } from "./profile";

export enum Roles {
    Customer = "customer",
    ProjectManager = "project manager",
    Designer = "designer",
    Admin = "admin",
}

export const Project = createTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
    description: text("description"),
    customerId: uuid("customer_id").references(() => Profile.id),
    createdAt: timestamp("created_at")
        .default(sql`now()`)
        .notNull(),
    updatedAt: timestamp("updatedAt", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
});

export const SelectProjectSchema = createSelectSchema(Project);

export const SelectProjectAndRoleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    customerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    role: z.nativeEnum(Roles),
});

export const CreateProjectSchema = createInsertSchema(Project, {
    name: z.string().max(256, { message: "Name is too long" }),
    description: z.string(),
}).omit({
    id: true,
    customerId: true,
    ...timestamps,
});

export const Role = createTable("role", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }),
});

export const ProjectUsers = createTable(
    "project_users",
    {
        projectId: uuid("project_id")
            .notNull()
            .references(() => Project.id, {
                onDelete: "cascade",
            }),
        profileId: uuid("profile_id")
            .notNull()
            .references(() => Profile.id, {
                onDelete: "cascade",
            }),
        roleId: uuid("role_id")
            .notNull()
            .references(() => Role.id, {
                onDelete: "cascade",
            }),
    },
    (table) => {
        return {
            pk: primaryKey({
                columns: [table.projectId, table.profileId, table.roleId],
            }),
            pkWithCustomName: primaryKey({
                name: "projectId_profileId_roleId",
                columns: [table.projectId, table.profileId, table.roleId],
            }),
        };
    },
);

export const Files = createTable("files", {
    id: uuid("id").primaryKey().defaultRandom(),
    path: varchar("path", { length: 256 }),
    projectId: uuid("project_id")
        .notNull()
        .references(() => Project.id, {
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at")
        .default(sql`now()`)
        .notNull(),
    updatedAt: timestamp("updatedAt", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
});
