import type { pathsTable } from '@/infra/db/schemas';

export type DbPath = typeof pathsTable.$inferSelect;
