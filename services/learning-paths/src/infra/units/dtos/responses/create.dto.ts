import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class CreateUnitResponseDto {
	@ApiProperty({ type: UnitResponseDto })
	unit: UnitResponseDto
}
