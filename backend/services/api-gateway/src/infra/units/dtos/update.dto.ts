import { ApiPropertyOptional } from '@nestjs/swagger'
import { UnitConstraints } from '@/domain/units/enums'

export class UpdateUnitBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null

	@ApiPropertyOptional({
		type: 'number',
	})
	order?: number
}
