import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js'
import type { SectionResponseDto } from '../dtos'

export function clientSectionToResponseDto(
	client: ClientSection,
): SectionResponseDto {
	return {
		...client,
		description: emptyStringToNull(client.description),
	}
}
