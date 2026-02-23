import { activityProgressTable } from '@/infra/db/schemas';

export type DbActivityProgress = typeof activityProgressTable.$inferSelect;
