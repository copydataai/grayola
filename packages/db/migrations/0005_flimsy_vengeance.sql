ALTER TABLE "t3turbo_files" ALTER COLUMN "path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "t3turbo_projects" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "t3turbo_projects" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "t3turbo_projects" ALTER COLUMN "customer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "t3turbo_role" ALTER COLUMN "name" DROP NOT NULL;