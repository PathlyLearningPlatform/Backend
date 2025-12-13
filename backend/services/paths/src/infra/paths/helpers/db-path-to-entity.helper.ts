import { Path } from '@/domain/paths/entities';
import { DbPath } from '../types';

export function dbPathToEntity(db: DbPath): Path {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
