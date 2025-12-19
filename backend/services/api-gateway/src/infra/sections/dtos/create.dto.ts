import { SectionConstraints } from '@/domain/sections/enums'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSectionBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: SectionConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: SectionConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	pathId: string
}
