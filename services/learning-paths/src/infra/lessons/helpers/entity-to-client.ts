import { nullToEmptyString } from '@pathly-backend/common';
import type { Lesson as ClientLesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type { Lesson } from '@/domain/lessons/entities';

export function lessonEntityToClient(entity: Lesson): ClientLesson {
	return {
		id: entity.id,
		name: entity.name,
		activityCount: entity.activityCount,
		order: entity.order,
		unitId: entity.unitId,
		description: nullToEmptyString(entity.description),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
	};
}
