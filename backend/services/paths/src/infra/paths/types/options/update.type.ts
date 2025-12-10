import type { pathsTable } from '@/infra/db/schemas';

type Fields = Partial<
	Omit<typeof pathsTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>
>;

export type UpdatePathOptions = {
	where: {
		id: string;
	};
	fields?: Fields;
};
