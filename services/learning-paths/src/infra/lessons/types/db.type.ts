import type { lessonsTable } from "@/infra/common/db/schemas";

export type DbLesson = typeof lessonsTable.$inferSelect;
