ALTER TABLE "activity_progress" DROP CONSTRAINT "uq_activity_progress_activity_id_user_id";--> statement-breakpoint
ALTER TABLE "learning_path_progress" DROP CONSTRAINT "uq_learning_path_progress_learning_path_id_user_id";--> statement-breakpoint
ALTER TABLE "lesson_progress" DROP CONSTRAINT "uq_lesson_progress_lesson_id_user_id";--> statement-breakpoint
ALTER TABLE "section_progress" DROP CONSTRAINT "uq_section_progress_section_id_user_id";--> statement-breakpoint
ALTER TABLE "unit_progress" DROP CONSTRAINT "uq_unit_progress_unit_id_user_id";--> statement-breakpoint
ALTER TABLE "activity_progress" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "learning_path_progress" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "lesson_progress" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "section_progress" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "unit_progress" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "activity_progress" ADD PRIMARY KEY ("activity_id","user_id");--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD PRIMARY KEY ("learning_path_id","user_id");--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD PRIMARY KEY ("lesson_id","user_id");--> statement-breakpoint
ALTER TABLE "section_progress" ADD PRIMARY KEY ("section_id","user_id");--> statement-breakpoint
ALTER TABLE "unit_progress" ADD PRIMARY KEY ("unit_id","user_id");