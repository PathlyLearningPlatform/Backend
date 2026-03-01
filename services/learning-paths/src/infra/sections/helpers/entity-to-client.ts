import { nullToEmptyString } from '@pathly-backend/common';
import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type { Section } from '@/domain/sections/entities';

export function sectionEntityToClient(entity: Section): ClientSection {
	return {
		id: entity.id,
		name: entity.name,
		learningPathId: entity.learningPathId,
		order: entity.order,
		unitCount: entity.unitCount,
		description: nullToEmptyString(entity.description),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
	};
}
