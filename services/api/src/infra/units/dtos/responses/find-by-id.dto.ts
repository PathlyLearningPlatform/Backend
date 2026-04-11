import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class FindUnitByIdResponseDto {
	@ApiProperty({ type: UnitResponseDto })
	unit: UnitResponseDto
}
