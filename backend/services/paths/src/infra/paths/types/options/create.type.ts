import type { pathsTable } from '@/infra/db/schemas';

export type CreatePathOptions = Omit<
	typeof pathsTable.$inferInsert,
	'id' | 'createdAt' | 'updatedAt'
>;
