import type { sectionsTable } from '@/infra/db/schemas';

export type CreateSectionOptions = Omit<
	typeof sectionsTable.$inferInsert,
	'id' | 'createdAt' | 'updatedAt'
>;
