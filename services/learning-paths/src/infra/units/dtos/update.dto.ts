import { ApiPropertyOptional } from '@nestjs/swagger'
import { UnitsApiConstraints } from '@infra/units/enums'

export class UpdateUnitBodyDto {
	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitsApiConstraints.MAX_NAME_LENGTH,
	})
	name?: string

	@ApiPropertyOptional({
		type: 'string',
		maxLength: UnitsApiConstraints.MAX_DESCRIPTION_LENGTH,
		nullable: true,
	})
	description?: string | null
}
