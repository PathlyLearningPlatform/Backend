import type { Path } from '@/domain/paths/entities';
import type { DbPath } from '../types';

export function dbPathToEntity(db: DbPath): Path {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
