CREATE TYPE "activity_type" AS ENUM('article', 'quiz', 'exercise');--> statement-breakpoint
CREATE TYPE "exercise_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "exercise_status" AS ENUM('IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "exercise_submission_conclusion" AS ENUM('FAILED', 'SUCCESS', 'PENDING');--> statement-breakpoint
CREATE TYPE "exercise_submission_status" AS ENUM('FAILED', 'PENDING', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "project_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "project_submission_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY,
	"lesson_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"type" "activity_type" NOT NULL,
	CONSTRAINT "uq_activities_lesson_id_order" UNIQUE("lesson_id","order")
);
--> statement-breakpoint
CREATE TABLE "activity_progress" (
	"activity_id" uuid,
	"lesson_id" uuid NOT NULL,
	"user_id" uuid,
	"completed_at" timestamp,
	CONSTRAINT "activity_progress_pkey" PRIMARY KEY("activity_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"activity_id" uuid PRIMARY KEY,
	"ref" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_progress" (
	"exercise_id" uuid,
	"user_id" uuid,
	"completed_at" timestamp,
	"updated_at" timestamp,
	"status" "exercise_status" NOT NULL,
	"repository_url" text NOT NULL,
	"repository_id" integer NOT NULL UNIQUE,
	CONSTRAINT "exercise_progress_pkey" PRIMARY KEY("exercise_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "exercise_submissions" (
	"id" uuid PRIMARY KEY,
	"exercise_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp,
	"submitted_at" timestamp NOT NULL,
	"status" "exercise_submission_status" NOT NULL,
	"commit_sha" text NOT NULL UNIQUE,
	"conclusion" "exercise_submission_conclusion"
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"accept_url" text NOT NULL,
	"difficulty" "exercise_difficulty" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"repository_id" integer NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "learning_path_progress" (
	"learning_path_id" uuid,
	"user_id" uuid,
	"completed_at" timestamp,
	"completed_section_count" integer DEFAULT 0 NOT NULL,
	"total_section_count" integer NOT NULL,
	CONSTRAINT "learning_path_progress_pkey" PRIMARY KEY("learning_path_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "learning_paths" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"section_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"lesson_id" uuid,
	"unit_id" uuid NOT NULL,
	"user_id" uuid,
	"completed_at" timestamp,
	"completed_activity_count" integer DEFAULT 0 NOT NULL,
	"total_activity_count" integer NOT NULL,
	CONSTRAINT "lesson_progress_pkey" PRIMARY KEY("lesson_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" uuid PRIMARY KEY,
	"unit_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"activity_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "uq_lessons_unit_id_order" UNIQUE("unit_id","order")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"order" integer NOT NULL,
	"quiz_id" uuid NOT NULL,
	"content" text NOT NULL,
	"correct_answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"activity_id" uuid PRIMARY KEY
);
--> statement-breakpoint
CREATE TABLE "section_progress" (
	"section_id" uuid,
	"learning_path_id" uuid NOT NULL,
	"user_id" uuid,
	"completed_at" timestamp,
	"completed_unit_count" integer DEFAULT 0 NOT NULL,
	"total_unit_count" integer NOT NULL,
	CONSTRAINT "section_progress_pkey" PRIMARY KEY("section_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY,
	"learning_path_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"unit_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "uq_sections_learning_path_id_order" UNIQUE("learning_path_id","order")
);
--> statement-breakpoint
CREATE TABLE "unit_progress" (
	"unit_id" uuid,
	"section_id" uuid NOT NULL,
	"user_id" uuid,
	"completed_at" timestamp,
	"completed_lesson_count" integer DEFAULT 0 NOT NULL,
	"total_lesson_count" integer NOT NULL,
	CONSTRAINT "unit_progress_pkey" PRIMARY KEY("unit_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY,
	"section_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"name" varchar(255) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"lesson_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "uq_units_section_id_order" UNIQUE("section_id","order")
);
--> statement-breakpoint
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
	"project_id" uuid,
	"user_id" uuid,
	"completed_at" timestamp,
	"updated_at" timestamp,
	"status" "project_status" NOT NULL,
	"repository_url" text NOT NULL,
	"repository_id" integer NOT NULL UNIQUE,
	CONSTRAINT "project_progress_pkey" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "project_submissions" (
	"id" uuid PRIMARY KEY,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp,
	"submitted_at" timestamp NOT NULL,
	"status" "project_submission_status" NOT NULL,
	"commit_sha" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"accept_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"repositoryId" integer NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id");--> statement-breakpoint
ALTER TABLE "activity_progress" ADD CONSTRAINT "activity_progress_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id");--> statement-breakpoint
ALTER TABLE "activity_progress" ADD CONSTRAINT "activity_progress_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exercise_progress" ADD CONSTRAINT "exercise_progress_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id");--> statement-breakpoint
ALTER TABLE "exercise_submissions" ADD CONSTRAINT "exercise_submissions_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id");--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD CONSTRAINT "learning_path_progress_learning_path_id_learning_paths_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id");--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id");--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id");--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_activity_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("activity_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id");--> statement-breakpoint
ALTER TABLE "section_progress" ADD CONSTRAINT "section_progress_learning_path_id_learning_paths_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id");--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_learning_path_id_learning_paths_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id");--> statement-breakpoint
ALTER TABLE "unit_progress" ADD CONSTRAINT "unit_progress_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id");--> statement-breakpoint
ALTER TABLE "unit_progress" ADD CONSTRAINT "unit_progress_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id");--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id");--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_activity_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("activity_id");--> statement-breakpoint
ALTER TABLE "project_progress" ADD CONSTRAINT "project_progress_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id");--> statement-breakpoint
ALTER TABLE "project_submissions" ADD CONSTRAINT "project_submissions_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id");