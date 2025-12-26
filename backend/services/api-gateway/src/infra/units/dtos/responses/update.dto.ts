import { ApiProperty } from '@nestjs/swagger'
import { UnitResponseDto } from '../response.dto'

export class UpdateUnitResponseDto {
	@ApiProperty({ type: UnitResponseDto })
	unit: UnitResponseDto
}
