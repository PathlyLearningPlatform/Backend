import type { SectionProgress as ClientSectionProgress } from '@pathly-backend/contracts/progress/v1/sections.js'
import type { SectionProgressResponseDto } from '../dtos'

export function clientSectionProgressToResponseDto(
	client: ClientSectionProgress,
): SectionProgressResponseDto {
	return {
		id: client.id,
		sectionId: client.sectionId,
		learningPathId: client.learningPathId,
		userId: client.userId,
		completedAt: client.completedAt,
		totalUnitCount: client.totalUnitCount,
		completedUnitCount: client.completedUnitCount,
	}
}
