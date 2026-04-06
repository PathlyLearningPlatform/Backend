import type { UnitProgress as ClientUnitProgress } from '@pathly-backend/contracts/learning_paths/v1/units.js';
import type { Unit } from '@pathly-backend/contracts/learning-paths/v1/units.js';
import type { UnitDto, UnitProgressDto } from '@/app/units/dtos';

export function unitDtoToClient(dto: UnitDto): Unit {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		sectionId: dto.sectionId,
		lessonCount: dto.lessonCount,
	};
}

export function unitProgressDtoToClient(
	dto: UnitProgressDto,
): ClientUnitProgress {
	return {
		unitId: dto.unitId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalLessonCount: dto.totalLessonCount,
		completedLessonCount: dto.completedLessonCount,
		sectionId: dto.sectionId,
	};
}
