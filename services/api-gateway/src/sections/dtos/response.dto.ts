import { ApiProperty } from '@nestjs/swagger'
import { SectionsApiConstraints } from '@/sections/enums'

export class SectionResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	learningPathId: string

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	createdAt: string

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	updatedAt: string

	@ApiProperty({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: SectionsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number
}
