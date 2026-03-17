import type { UnitProgressDto } from '@/app/unit-progress';
import type { UnitProgress as ClientUnitProgress } from '@pathly-backend/contracts/progress/v1/units.js';

export function unitProgressDtoToClient(
	dto: UnitProgressDto,
): ClientUnitProgress {
	return {
		id: dto.id,
		unitId: dto.unitId,
		sectionId: dto.sectionId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalLessonCount: dto.totalLessonCount,
		completedLessonCount: dto.completedLessonCount,
	};
}
