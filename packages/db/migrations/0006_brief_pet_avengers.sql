ALTER TABLE "t3turbo_files" DROP CONSTRAINT "t3turbo_files_project_id_t3turbo_projects_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "t3turbo_files" ADD CONSTRAINT "t3turbo_files_project_id_t3turbo_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."t3turbo_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
