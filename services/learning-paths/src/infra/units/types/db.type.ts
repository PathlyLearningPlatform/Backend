import { unitsTable } from '@/infra/common/db/schemas';

export type DbUnit = typeof unitsTable.$inferSelect;
