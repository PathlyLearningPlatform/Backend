CREATE TYPE "activity_type" AS ENUM('article', 'quiz', 'exercise');--> statement-breakpoint
CREATE TYPE "exercise_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
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
CREATE TABLE "articles" (
	"activity_id" uuid PRIMARY KEY,
	"ref" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"activity_id" uuid PRIMARY KEY,
	"difficulty" "exercise_difficulty" NOT NULL
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
ALTER TABLE "activities" ADD CONSTRAINT "activities_lesson_id_lessons_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_unit_id_units_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_activity_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("activity_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_activity_id_activities_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_learning_path_id_learning_paths_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id");--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_section_id_sections_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id");