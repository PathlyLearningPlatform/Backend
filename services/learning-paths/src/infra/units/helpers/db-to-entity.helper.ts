import { Unit } from '@/domain/units/entities';
import type { DbUnit } from '../types';

export function dbUnitToEntity(db: DbUnit): Unit {
	return new Unit({
		id: db.id,
		sectionId: db.sectionId,
		createdAt: db.createdAt,
		updatedAt: db.updatedAt,
		name: db.name,
		description: db.description,
		order: db.order,
	});
}
