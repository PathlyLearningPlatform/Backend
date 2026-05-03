CREATE TYPE "exercise_status" AS ENUM('IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "exercise_submission_conclusion" AS ENUM('FAILED', 'SUCCESS', 'PENDING');--> statement-breakpoint
CREATE TYPE "exercise_submission_status" AS ENUM('FAILED', 'PENDING', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "exercise_progress" (
	"exerciseId" uuid,
	"userId" uuid,
	"completed_at" timestamp,
	"updated_at" timestamp,
	"status" "exercise_status" NOT NULL,
	"repositoryUrl" text NOT NULL,
	"repositoryId" integer NOT NULL UNIQUE,
	CONSTRAINT "exercise_progress_pkey" PRIMARY KEY("exerciseId","userId")
);
--> statement-breakpoint
CREATE TABLE "exercise_submissions" (
	"id" uuid PRIMARY KEY,
	"exerciseId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"updated_at" timestamp,
	"submitted_at" timestamp NOT NULL,
	"status" "exercise_submission_status" NOT NULL,
	"commitSha" text NOT NULL UNIQUE,
	"conclusion" "exercise_submission_conclusion"
);
--> statement-breakpoint
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_activity_id_activities_id_fkey";--> statement-breakpoint
ALTER TABLE "exercises" RENAME COLUMN "activity_id" TO "id";--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "acceptUrl" text NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "repositoryId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_repositoryId_key" UNIQUE("repositoryId");--> statement-breakpoint
ALTER TABLE "exercise_progress" ADD CONSTRAINT "exercise_progress_exerciseId_exercises_id_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id");--> statement-breakpoint
ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_exerciseId_exercises_id_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id");