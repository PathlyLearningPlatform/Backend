ALTER TABLE "activity_progress" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_progress" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_path_progress" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "section_progress" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "section_progress" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "unit_progress" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "unit_progress" ADD COLUMN "updated_at" timestamp;