import type { UnitDto, UnitProgressDto } from '@/app/units/dtos';
import type { UnitProgressResponseDto, UnitResponseDto } from '../dtos';

export function clientUnitToResponseDto(unit: UnitDto): UnitResponseDto {
	return {
		id: unit.id,
		name: unit.name,
		order: unit.order,
		createdAt: unit.createdAt.toISOString(),
		lessonCount: unit.lessonCount,
		sectionId: unit.sectionId,
		description: unit.description,
		updatedAt: unit.updatedAt ? unit.updatedAt.toISOString() : null,
	};
}

export function clientUnitProgressToResponseDto(
	progress: UnitProgressDto,
): UnitProgressResponseDto {
	return {
		id: progress.id,
		unitId: progress.unitId,
		sectionId: progress.sectionId,
		userId: progress.userId,
		completedAt: progress.completedAt?.toISOString() ?? null,
		totalLessonCount: progress.totalLessonCount,
		completedLessonCount: progress.completedLessonCount,
	};
}
