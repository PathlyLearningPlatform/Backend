import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class RemoveUnitResponseDto {
	@ApiProperty({ type: UnitResponseDto })
	unit: UnitResponseDto
}
