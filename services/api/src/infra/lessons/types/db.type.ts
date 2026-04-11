import type { lessonsTable } from '@/infra/db/schemas';

export type DbLesson = typeof lessonsTable.$inferSelect;
