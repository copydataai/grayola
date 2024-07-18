import { relations } from "drizzle-orm";
import { text, uuid, varchar } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Users } from "./auth";

export const Profile = createTable("profile", {
  // Matches id from auth.users table in Supabase
  id: uuid("id")
    .primaryKey()
    .references(() => Users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  image: text("image"),
  email: varchar("email", { length: 256 }),
});
