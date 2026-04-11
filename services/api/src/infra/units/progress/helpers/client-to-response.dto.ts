import type { UnitProgressResponseDto } from '../dtos';

type UnitProgressLike = {
	id: string;
	unitId: string;
	sectionId: string;
	userId: string;
	completedAt: Date | string | null;
	totalLessonCount: number;
	completedLessonCount: number;
};

export function clientUnitProgressToResponseDto(
	client: UnitProgressLike,
): UnitProgressResponseDto {
	return {
		id: client.id,
		unitId: client.unitId,
		sectionId: client.sectionId,
		userId: client.userId,
		completedAt:
			client.completedAt instanceof Date
				? client.completedAt.toISOString()
				: client.completedAt,
		totalLessonCount: client.totalLessonCount,
		completedLessonCount: client.completedLessonCount,
	};
}
