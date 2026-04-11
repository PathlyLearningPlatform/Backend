import type { SectionProgressResponseDto } from '../dtos';

type SectionProgressLike = {
	id: string;
	sectionId: string;
	learningPathId: string;
	userId: string;
	completedAt: Date | string | null;
	totalUnitCount: number;
	completedUnitCount: number;
};

export function clientSectionProgressToResponseDto(
	client: SectionProgressLike,
): SectionProgressResponseDto {
	return {
		id: client.id,
		sectionId: client.sectionId,
		learningPathId: client.learningPathId,
		userId: client.userId,
		completedAt:
			client.completedAt instanceof Date
				? client.completedAt.toISOString()
				: client.completedAt,
		totalUnitCount: client.totalUnitCount,
		completedUnitCount: client.completedUnitCount,
	};
}
