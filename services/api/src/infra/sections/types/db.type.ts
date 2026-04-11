import type { sectionsTable } from '@/infra/db/schemas';

export type DbSection = typeof sectionsTable.$inferSelect;
