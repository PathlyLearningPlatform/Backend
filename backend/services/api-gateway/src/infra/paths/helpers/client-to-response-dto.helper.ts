import { emptyStringToNull } from '@pathly-backend/common/index.js'
import { PathResponseDto } from '../dtos'
import { Path as ClientPath } from '@pathly-backend/contracts/paths/v1/paths.js'

export function clientPathToResponseDto(entity: ClientPath): PathResponseDto {
	return {
		...entity,
		description: emptyStringToNull(entity.description),
	}
}
