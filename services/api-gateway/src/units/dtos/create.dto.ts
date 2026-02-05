import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UnitsApiConstraints } from '@/units/enums'

export class CreateUnitBodyDto {
	@ApiProperty({
		type: 'string',
		maxLength: UnitsApiConstraints.MAX_NAME_LENGTH,
	})
	name: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitsApiConstraints.MAX_DESCRIPTION_LENGTH,
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
