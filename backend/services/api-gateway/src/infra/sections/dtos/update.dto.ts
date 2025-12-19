import { SectionConstraints } from '@/domain/sections/enums'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateSectionBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiPropertyOptional({
		type: 'number',
	})
	order?: number
}
