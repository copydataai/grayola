CREATE TABLE IF NOT EXISTS "t3turbo_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" varchar(256) NOT NULL,
	"project_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3turbo_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3turbo_project_users" (
	"project_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "t3turbo_project_users_project_id_profile_id_role_id_pk" PRIMARY KEY("project_id","profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "t3turbo_role" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_files" ADD CONSTRAINT "t3turbo_files_project_id_t3turbo_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."t3turbo_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_projects" ADD CONSTRAINT "t3turbo_projects_customer_id_t3turbo_profile_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."t3turbo_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_project_users" ADD CONSTRAINT "t3turbo_project_users_project_id_t3turbo_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."t3turbo_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_project_users" ADD CONSTRAINT "t3turbo_project_users_profile_id_t3turbo_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."t3turbo_profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_project_users" ADD CONSTRAINT "t3turbo_project_users_role_id_t3turbo_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."t3turbo_role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
