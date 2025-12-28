import type { Section } from '@/domain/sections/entities';
import type { DbSection } from '../types';

export function dbSectionToEntity(db: DbSection): Section {
	return {
		...db,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
	};
}
