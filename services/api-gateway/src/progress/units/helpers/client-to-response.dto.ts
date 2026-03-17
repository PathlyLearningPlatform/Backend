import type { UnitProgress as ClientUnitProgress } from '@pathly-backend/contracts/progress/v1/units.js'
import type { UnitProgressResponseDto } from '../dtos'

export function clientUnitProgressToResponseDto(
	client: ClientUnitProgress,
): UnitProgressResponseDto {
	return {
		id: client.id,
		unitId: client.unitId,
		sectionId: client.sectionId,
		userId: client.userId,
		completedAt: client.completedAt,
		totalLessonCount: client.totalLessonCount,
		completedLessonCount: client.completedLessonCount,
	}
}
