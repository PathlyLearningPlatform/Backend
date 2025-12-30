import type { unitsTable } from '@/infra/db/schemas';

export type DbUnit = typeof unitsTable.$inferSelect;
