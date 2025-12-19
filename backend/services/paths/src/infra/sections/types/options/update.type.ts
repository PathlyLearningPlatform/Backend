import type { sectionsTable } from '@/infra/db/schemas';

type Fields = Partial<
	Omit<
		typeof sectionsTable.$inferInsert,
		'id' | 'createdAt' | 'updatedAt' | 'pathId'
	>
>;

export type UpdateSectionOptions = {
	where: {
		id: string;
	};
	fields?: Fields;
};
