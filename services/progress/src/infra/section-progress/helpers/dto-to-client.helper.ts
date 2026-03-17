import type { SectionProgressDto } from '@/app/section-progress';
import type { SectionProgress as ClientSectionProgress } from '@pathly-backend/contracts/progress/v1/sections.js';

export function sectionProgressDtoToClient(
	dto: SectionProgressDto,
): ClientSectionProgress {
	const completedAt = (
		dto as SectionProgressDto & { completedAt?: Date | null }
	).completedAt;

	return {
		id: dto.id,
		sectionId: dto.sectionId,
		learningPathId: dto.learningPathId,
		userId: dto.userId,
		completedAt: completedAt?.toISOString() ?? '',
		totalUnitCount: dto.totalUnitCount,
		completedUnitCount: dto.completedUnitCount,
	};
}
