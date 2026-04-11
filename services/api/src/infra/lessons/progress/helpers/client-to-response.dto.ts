import type { LessonProgressResponseDto } from '../dtos';

type LessonProgressLike = {
	id: string;
	lessonId: string;
	unitId: string;
	userId: string;
	completedAt: Date | string | null;
	totalActivityCount: number;
	completedActivityCount: number;
};

export function clientLessonProgressToResponseDto(
	client: LessonProgressLike,
): LessonProgressResponseDto {
	return {
		lessonId: client.lessonId,
		userId: client.userId,
		completedAt:
			client.completedAt instanceof Date
				? client.completedAt.toISOString()
				: client.completedAt,
		totalActivityCount: client.totalActivityCount,
		completedActivityCount: client.completedActivityCount,
		id: client.id,
		unitId: client.unitId,
	};
}
