import { emptyStringToNull } from '@pathly-backend/common/index.js'
import { SectionResponseDto } from '../dtos'
import { Section as ClientSection } from '@pathly-backend/contracts/paths/v1/sections.js'

export function clientSectionToResponseDto(
	client: ClientSection,
): SectionResponseDto {
	return {
		...client,
		description: emptyStringToNull(client.description),
	}
}
