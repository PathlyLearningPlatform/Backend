ALTER TABLE "project_progress" ADD COLUMN "repositoryId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "repositoryId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "project_progress" ADD CONSTRAINT "project_progress_repositoryId_key" UNIQUE("repositoryId");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_repositoryId_key" UNIQUE("repositoryId");