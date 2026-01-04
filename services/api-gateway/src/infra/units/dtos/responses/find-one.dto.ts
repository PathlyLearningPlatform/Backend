import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class FindOneUnitResponseDto {
	@ApiProperty({ type: UnitResponseDto })
	unit: UnitResponseDto
}
