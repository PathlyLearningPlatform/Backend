import type { activitiesTable } from '@/infra/db/schemas';

export type DbActivity = typeof activitiesTable.$inferSelect;
