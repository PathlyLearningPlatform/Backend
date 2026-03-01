import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Unit as ClientUnit } from '@pathly-backend/contracts/learning-paths/v1/units.js'
import type { UnitResponseDto } from '../dtos'

export function clientUnitToResponseDto(client: ClientUnit): UnitResponseDto {
	return {
		id: client.id,
		name: client.name,
		order: client.order,
		createdAt: client.createdAt,
		lessonCount: client.lessonCount,
		sectionId: client.sectionId,
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.description),
	}
}
