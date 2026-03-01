import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js'
import type { SectionResponseDto } from '../dtos'

export function clientSectionToResponseDto(
	client: ClientSection,
): SectionResponseDto {
	return {
		id: client.id,
		name: client.name,
		createdAt: client.createdAt,
		learningPathId: client.learningPathId,
		order: client.order,
		unitCount: client.unitCount,
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.description),
	}
}
