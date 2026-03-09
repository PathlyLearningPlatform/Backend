import { ApiPropertyOptional } from '@nestjs/swagger'
import { SectionsApiConstraints } from '@/sections/enums'

export class UpdateSectionBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
