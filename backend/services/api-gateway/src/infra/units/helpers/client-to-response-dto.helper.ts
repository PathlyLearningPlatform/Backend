import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Unit as ClientUnit } from '@pathly-backend/contracts/learning-paths/v1/units.js'
import type { UnitResponseDto } from '../dtos'

export function clientUnitToResponseDto(client: ClientUnit): UnitResponseDto {
	return {
		...client,
		description: emptyStringToNull(client.description),
	}
}
