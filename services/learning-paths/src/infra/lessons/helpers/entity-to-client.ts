import { nullToEmptyString } from '@pathly-backend/common';
import type { Lesson as ClientLesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type { Lesson } from '@/domain/lessons/entities';

export function lessonEntityToClient(entity: Lesson): ClientLesson {
	return {
		...entity,
		description: nullToEmptyString(entity.description),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
	};
}
