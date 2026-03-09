import { LessonDto } from '@/app/lessons/dtos';
import { Lesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js';

export function lessonDtoToClient(dto: LessonDto): Lesson {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		unitId: dto.unitId,
		activityCount: dto.activityCount,
	};
}
