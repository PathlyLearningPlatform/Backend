import { ApiProperty } from '@nestjs/swagger'
import { UnitProgressResponseDto } from '../response.dto'

export class StartUnitResponseDto {
	@ApiProperty({ type: UnitProgressResponseDto })
	unitProgress: UnitProgressResponseDto
}
