import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SectionsApiConstraints } from '@/sections/enums'

export class CreateSectionBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	learningPathId: string
}
