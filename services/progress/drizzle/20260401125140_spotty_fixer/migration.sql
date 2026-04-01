CREATE TABLE "activity_progress" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"activity_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "uq_activity_progress_activity_id_user_id" UNIQUE("activity_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"id" uuid PRIMARY KEY,
	"lesson_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"completed_at" timestamp,
	"completed_activity_count" integer DEFAULT 0 NOT NULL,
	"total_activity_count" integer NOT NULL,
	CONSTRAINT "uq_lesson_progress_lesson_id_user_id" UNIQUE("lesson_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "unit_progress" (
	"id" uuid PRIMARY KEY,
	"unit_id" uuid NOT NULL,
	"section_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"completed_at" timestamp,
	"completed_lesson_count" integer DEFAULT 0 NOT NULL,
	"total_lesson_count" integer NOT NULL,
	CONSTRAINT "uq_unit_progress_unit_id_user_id" UNIQUE("unit_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "section_progress" (
	"id" uuid PRIMARY KEY,
	"section_id" uuid NOT NULL,
	"learning_path_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"completed_at" timestamp,
	"completed_unit_count" integer DEFAULT 0 NOT NULL,
	"total_unit_count" integer NOT NULL,
	CONSTRAINT "uq_section_progress_section_id_user_id" UNIQUE("section_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "learning_path_progress" (
	"id" uuid PRIMARY KEY,
	"learning_path_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"completed_at" timestamp,
	"completed_section_count" integer DEFAULT 0 NOT NULL,
	"total_section_count" integer NOT NULL,
	CONSTRAINT "uq_learning_path_progress_learning_path_id_user_id" UNIQUE("learning_path_id","user_id")
);
