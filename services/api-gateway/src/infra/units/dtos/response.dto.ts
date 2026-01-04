import { ApiProperty } from '@nestjs/swagger'
import { UnitConstraints } from '@/domain/units/enums'

export class UnitResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id: string

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	sectionId: string

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
		maxLength: UnitConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiProperty({
		type: 'string',
		maxLength: UnitConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description: string | null

	@ApiProperty({
		type: 'number',
	})
	order: number
}
