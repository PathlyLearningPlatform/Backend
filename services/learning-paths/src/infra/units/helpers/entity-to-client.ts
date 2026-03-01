import { nullToEmptyString } from '@pathly-backend/common';
import type { Unit as ClientUnit } from '@pathly-backend/contracts/learning-paths/v1/units.js';
import type { Unit } from '@/domain/units/entities';

export function unitEntityToClient(entity: Unit): ClientUnit {
	return {
		id: entity.id,
		name: entity.name,
		order: entity.order,
		lessonCount: entity.lessonCount,
		sectionId: entity.sectionId,
		description: nullToEmptyString(entity.description),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
	};
}
