import { activitiesTable } from '@/infra/common/db/schemas';

export type DbActivity = typeof activitiesTable.$inferSelect;
