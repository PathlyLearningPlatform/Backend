import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UnitConstraints } from '@/domain/units/enums'

export class CreateUnitBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: UnitConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitConstraints.MAX_DESCRIPTION_LENGTH,
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
	sectionId: string
}
