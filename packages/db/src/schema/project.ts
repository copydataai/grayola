import { relations, sql } from "drizzle-orm";
import {
    primaryKey,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Profile } from "./profile";

export const Project = createTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("name", { length: 256 }).notNull(),
    description: text("description").notNull(),
    customerId: uuid("customer_id")
        .notNull()
        .references(() => Profile.id),
    createdAt: timestamp("created_at")
        .default(sql`now()`)
        .notNull(),
    updatedAt: timestamp("updatedAt", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
});

export const CreateProjectSchema = createInsertSchema(Project, {
    title: z.string().max(256),
    description: z.string(),
}).omit({
    id: true,
    ...timestamps,
});

export const Role = createTable("role", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
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
    path: varchar("path", { length: 256 }).notNull(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => Project.id),
    createdAt: timestamp("created_at")
        .default(sql`now()`)
        .notNull(),
    updatedAt: timestamp("updatedAt", {
        mode: "date",
        withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
});
