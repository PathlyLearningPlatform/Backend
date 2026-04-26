CREATE TYPE "project_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "project_submission_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" uuid PRIMARY KEY,
	"quiz_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"attempted_at" timestamp NOT NULL,
	"score" integer NOT NULL,
	"answers" jsonb[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_progress" (
	"projectId" uuid,
	"userId" uuid,
	"completed_at" timestamp,
	"updated_at" timestamp,
	"status" "project_status" NOT NULL,
	"repositoryUrl" text NOT NULL,
	CONSTRAINT "project_progress_pkey" PRIMARY KEY("projectId","userId")
);
--> statement-breakpoint
CREATE TABLE "project_submissions" (
	"id" uuid PRIMARY KEY,
	"projectId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"updated_at" timestamp,
	"submitted_at" timestamp NOT NULL,
	"status" "project_submission_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"acceptUrl" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_activity_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("activity_id");--> statement-breakpoint
ALTER TABLE "project_progress" ADD CONSTRAINT "project_progress_projectId_projects_id_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id");--> statement-breakpoint
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_projectId_projects_id_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id");