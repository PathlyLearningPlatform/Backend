import { Section } from '@/domain/sections/entities';
import type { DbSection } from '../types';

export function dbSectionToEntity(db: DbSection): Section {
	return new Section({
		id: db.id,
		learningPathId: db.learningPathId,
		createdAt: db.createdAt,
		updatedAt: db.updatedAt,
		description: db.description,
		name: db.name,
		order: db.order,
	});
}
