import type { pathsTable } from '@/infra/db/schemas';

export type DbPathEntity = typeof pathsTable.$inferSelect;
