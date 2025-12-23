import type { Unit } from '@/domain/units/entities';
import type { DbUnit } from '../types';

export function dbUnitToEntity(db: DbUnit): Unit {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
