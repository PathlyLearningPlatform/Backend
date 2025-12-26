import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Path as ClientPath } from '@pathly-backend/contracts/paths/v1/paths.js'
import type { PathResponseDto } from '../dtos'

export function clientPathToResponseDto(entity: ClientPath): PathResponseDto {
	return {
		...entity,
		description: emptyStringToNull(entity.description),
	}
}
