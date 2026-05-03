ALTER TABLE "exercise_progress" RENAME COLUMN "exerciseId" TO "exercise_id";--> statement-breakpoint
ALTER TABLE "exercise_progress" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "exercise_progress" RENAME COLUMN "repositoryUrl" TO "repository_url";--> statement-breakpoint
ALTER TABLE "exercise_progress" RENAME COLUMN "repositoryId" TO "repository_id";--> statement-breakpoint
ALTER TABLE "exercise_submissions" RENAME COLUMN "exerciseId" TO "exercise_id";--> statement-breakpoint
ALTER TABLE "exercise_submissions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "exercise_submissions" RENAME COLUMN "commitSha" TO "commit_sha";--> statement-breakpoint
ALTER TABLE "exercises" RENAME COLUMN "acceptUrl" TO "accept_url";--> statement-breakpoint
ALTER TABLE "exercises" RENAME COLUMN "repositoryId" TO "repository_id";--> statement-breakpoint
ALTER TABLE "project_progress" RENAME COLUMN "projectId" TO "project_id";--> statement-breakpoint
ALTER TABLE "project_progress" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "project_progress" RENAME COLUMN "repositoryUrl" TO "repository_url";--> statement-breakpoint
ALTER TABLE "project_progress" RENAME COLUMN "repositoryId" TO "repository_id";--> statement-breakpoint
ALTER TABLE "project_submissions" RENAME COLUMN "projectId" TO "project_id";--> statement-breakpoint
ALTER TABLE "project_submissions" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "project_submissions" RENAME COLUMN "commitSha" TO "commit_sha";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "acceptUrl" TO "accept_url";