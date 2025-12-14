import { PathConstraints } from '@/domain/paths/enums'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdatePathBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: PathConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: PathConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
